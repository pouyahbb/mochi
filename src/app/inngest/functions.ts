import { fetchMutation, fetchQuery } from "convex/nextjs";
import { inngest } from "./client";
import { api } from "../../../convex/_generated/api";
import { extractOrderLike, extractSubscriptionLike, extractCustomerLike, extractEmailFromEvent, extractUserIdFromMetadata, isEntitledStatus, isPolarWebhookEvent, PolarOrder, PolarSubscription, PolarCustomerData, ReceivedEvent, toMs } from "@/types/polar";
import { Id } from "../../../convex/_generated/dataModel";

export const autosaveProjectWorkflow = inngest.createFunction(
    {id : "autosave-project-workflow"},
    {event : 'project/autosave.requested'},
    async ({event}) => {
        const {projectId , shapesData , viewportData} = event.data

        try{
            await fetchMutation(api.projects.updateProjectSketches , {
                projectId,
                sketchesData : shapesData ,
                viewportData
            })
            return {success : true}
        }catch(err){
            console.log(err)
            throw new Error("Failed to autosave project")
        }
    }
)

const grantKey = (subId : string  , periodEndMs?:number,eventId?:string | number) : string => {
    return periodEndMs != null ? `${subId}:${periodEndMs}` : eventId != null ? `${subId}:evt:${eventId}` : `${subId}:first`
}

export const handlePolarEvent = inngest.createFunction(
    {id : "polar-webhook-handler"} , 
    {event : "polar/webhook.received"},
    async({event , step}) => {
        console.log("=== INNGEST FUNCTION TRIGGERED ===")
        console.log("Function ID: polar-webhook-handler")
        console.log("Event Name:", event.name)
        console.log("Event ID:", event.id)
        console.log("Event Data:", JSON.stringify(event.data , null , 2))
        if(!isPolarWebhookEvent(event.data)){
            console.log("INNGEST: Not a valid Polar webhook event, skipping")
            return { skipped: true, reason: "invalid-event-shape" }
        }
        const incoming = event.data as ReceivedEvent
        const type = incoming.type
        const dataUnknown = incoming.data

        console.log("INNGEST: Event type:", type)

        const sub : PolarSubscription | null  = extractSubscriptionLike(dataUnknown)
        const order: PolarOrder | null = extractOrderLike(dataUnknown)
        const customer: PolarCustomerData | null = extractCustomerLike(dataUnknown)
        
        console.log("INNGEST: Extracted sub:", sub ? "found" : "null")
        console.log("INNGEST: Extracted order:", order ? "found" : "null")
        console.log("INNGEST: Extracted customer:", customer ? "found" : "null")
        
        // For customer events, we need customer data
        // For subscription events, we need sub or order
        const isCustomerEvent = /^customer\./i.test(type)
        const isSubscriptionEvent = /^subscription\.|^order\./i.test(type)
        
        if(!sub && !order && !customer){
            console.log("INNGEST: No subscription, order, or customer found. Skipping.")
            return { skipped: true, reason: "no-data" }
        }
        
        const userId :Id<"users"> | null = await step.run("resolve-user" , async () => {
            // Method 1: Try metadata.userId from various places
            const metaUserId = extractUserIdFromMetadata(dataUnknown) 
                ?? (sub?.metadata?.userId as string | undefined) 
                ?? (order?.metadata?.userId as string | undefined)
                ?? (customer?.metadata?.userId as string | undefined)
            
            console.log("INNGEST: Metadata userId:", metaUserId)
            
            if(metaUserId){
                console.log("INNGEST: Using metadata userId:", metaUserId)
                return metaUserId as unknown as Id<"users">
            }
            
            // Method 2: Try email from various places
            const email = extractEmailFromEvent(dataUnknown) 
                ?? sub?.customer?.email 
                ?? order?.customer?.email 
                ?? customer?.email
            
            console.log("INNGEST: Resolved email:", email)
            
            if(email){
                try{
                    console.log('INNGEST: Looking up user by email:', email)
                    const foundUserId = await fetchQuery(api.user.getUserIdByEmail, {
                        email
                    })
                    console.log("INNGEST: Found userId by email:", foundUserId)
                    return foundUserId
                }catch(err){
                    console.log("INNGEST: Failed to resolve email", err)
                    return null
                }
            }
            
            console.log("INNGEST: Could not resolve userId by any method")
            return null
        })
        console.log("INNGEST: Final resolved userId:", userId)
        if(!userId){
            console.log("INNGEST: No user id resolved. Skipping webhook process.")
            return { skipped: true, reason: "no-user-id" }
        }
        
        // Get subscription ID from various sources
        // For one-time purchases, use order.id as the subscription ID
        const activeSubFromCustomer = customer?.activeSubscriptions?.[0]
        const isOneTimePurchase = order && !order.subscription_id
        const polarSubscriptionId = sub?.id 
            ?? order?.subscription_id 
            ?? (isOneTimePurchase ? order?.id : null) // Use order.id for one-time purchases
            ?? activeSubFromCustomer?.id 
            ?? customer?.id // Fall back to customer ID for customer events
            ?? ""
            
        if(!polarSubscriptionId){
            console.log("INNGEST: No polar subscription/customer/order id found. Skipping.")
            return { skipped: true, reason: "no-subscription-id" }
        }
        
        console.log("INNGEST: polarSubscriptionId:", polarSubscriptionId)
        console.log("INNGEST: isOneTimePurchase:", isOneTimePurchase)
        
        // Determine status from subscription, order, or activeSubscriptions
        // For one-time purchases, use order status (e.g., 'paid')
        const status = sub?.status 
            ?? (isOneTimePurchase && order ? "paid" : null)
            ?? activeSubFromCustomer?.status 
            ?? (customer?.activeSubscriptions && customer.activeSubscriptions.length > 0 ? "active" : "updated")
        
        const currentPeriodEnd = toMs(sub?.current_period_end) 
            ?? toMs(activeSubFromCustomer?.currentPeriodEnd)
            
        const payload = {
            userId,
            polarCustomerId : sub?.customer?.id ?? sub?.customer_id ?? customer?.id ?? "",
            polarSubscriptionId,
            productId : sub?.product_id ?? sub?.product?.id ?? activeSubFromCustomer?.productId ?? undefined,
            priceId : sub?.prices?.[0]?.id ?? activeSubFromCustomer?.priceId ?? undefined,
            planCode : sub?.plan_code ?? sub?.product?.name ?? undefined,
            status,
            currentPeriodEnd,
            trialEndsAt:toMs(sub?.trial_ends_at),
            cancelAt : toMs(sub?.cancel_at),
            canceledAt : toMs(sub?.canceled_at),
            seats : sub?.seats ?? undefined,
            metadata : dataUnknown,
            creditsGrantPerPeriod : 10,
            creditsRolloverLimit : 100
        }
        console.log("Inngest , subscription payload: " , JSON.stringify(payload , null , 2))
        const subscriptionId = await step.run("upsert-subscription" , async () => {
            try{
                const existingByPolar = await fetchQuery(api.subscription.getByPolarId, {
                    polarSubscriptionId : payload.polarSubscriptionId
                })
                const existingByUser = await fetchQuery(api.subscription.getSubscriptionForUser , {userId : payload.userId})

                if(existingByPolar && existingByUser && existingByPolar._id !== existingByUser._id){
                    console.warn("inngest , DUPLICATE DETECTED, User has diffrent subscription by polar user ID vs User ID")
                }
                const result = await fetchMutation(api.subscription.upsertFromPolar , payload)
                const allUserSubs = await fetchQuery(api.subscription.getAllForUser , {userId : payload.userId})
                if(allUserSubs && allUserSubs.length > 1){
                    allUserSubs.forEach((sub , index) => {
                        console.error(`${index + 1}. ID: ${sub._id}, Polar ID: ${sub.polarSubscriptionId} , status : ${sub.status}`)
                    })
                }
                return result

            }catch(err){
                console.error("INNGEST, Failed to upsert subscription:" , err)
                console.error("INNGEST, Failed payload: " , JSON.stringify(payload , null , 2))
                throw err
            }
        })
        // Detect event types that should trigger subscription handling
        const looksCreate = /subscription\.created|subscription\.active|checkout\.created/i.test(type)
        const looksRenew = /subscription\.renew|subscription\.updated|invoice\.paid/i.test(type)
        const isOrderEvent = /order\.created|order\.updated|order\.paid/i.test(type)
        const isCustomerStateChange = /customer\.state_changed/i.test(type)
        const entitled = isEntitledStatus(payload.status)
        
        console.log("INNGEST: Credit granting analysis:")
        console.log(" - Event type:", type)
        console.log(" - Looks like create:", looksCreate)
        console.log(" - Looks like renew:", looksRenew)
        console.log(" - Is order event:", isOrderEvent)
        console.log(" - Is one-time purchase:", isOneTimePurchase)
        console.log(" - Is customer state change:", isCustomerStateChange)
        console.log(" - User entitled:", entitled)
        console.log(" - Status:", payload.status)

        const idk = grantKey(polarSubscriptionId , currentPeriodEnd , incoming.id)

        console.log("INNGEST: Idempotency key:", idk)
        
        // Grant credits on subscription create/renew, order events (one-time purchases), or customer state change
        const shouldGrantCredits = entitled && (looksCreate || looksRenew || isOrderEvent || isCustomerStateChange)
        console.log("INNGEST: Should grant credits:", shouldGrantCredits)
        
        if(shouldGrantCredits){
            const grant = await step.run("grant-credits" , async() => {
                try{
                    console.log("INNGEST , Granting credits to subscription: " , subscriptionId)
                    const result  = await fetchMutation(api.subscription.grantCreditsIfNeeded , {
                        subscriptionId,
                        idempotencyKey : idk,
                        amount : 10,
                        reason : looksCreate ? "initial-grant" : "periodic-grant"
                    })
                    console.log("INNGEST, credits granted successfully: ", result)  
                    return result
                }catch(err){
                    console.error("INNGEST, failed to grant credits : " , err)
                    throw err
                }
            })
            console.log("INNGEST, grant result: " , grant)
            if(grant.ok && !("skipped" in grant && grant.skipped)){
                await step.sendEvent("credits-granted",  {
                    name : "billing/credits.granted",
                    id : `credits-granted:${polarSubscriptionId}:${currentPeriodEnd ?? "first"}`,
                    data : {
                        userId,
                        amount : "granted" in grant ? (grant.granted ?? 10) : 10,
                        balance : "balance" in grant ? grant.balance : undefined,
                        periodEnd : currentPeriodEnd
                    }
                })
                console.log("INNGEST , credits granted event sent")
            }else{
                console.log("INNGEST, credits granting conditions not met")
            }
            await step.sendEvent("sub-synced" , {
                name : "billing/subscription.synced",
                id : `sub-synced:${polarSubscriptionId}:${currentPeriodEnd??"first"}`,
                data : {
                    userId,
                    polarSubscriptionId,
                    status : payload.status,
                    currentPeriodEnd
                }
            })
            console.log("INNGEST, subscription synced event send")
            if(currentPeriodEnd && currentPeriodEnd > Date.now()){
                const runAt = new Date(Math.max(Date.now() + 5000 , currentPeriodEnd - 3 * 24 * 60 * 60 * 1000))
                await step.sleepUntil("wait-until-expiry" , runAt)
                const stillEntitled = await step.run("check-entitlement" , async() => {
                    try{
                        const result = await fetchQuery(api.subscription.hasEntitlement , {
                            userId
                        })
                        console.log("INNGEST, Entitlment result:" , result)
                        return result
                    }catch(err){
                        console.error("INNGEST, failed to check entitlement : " , err)
                        throw err
                    }
                })
                if(stillEntitled){
                    await step.sendEvent("pre-expiry" , {
                        name : "billing/subscription.pre_expiry",
                        data : {
                            userId ,
                            runAt : runAt.toISOString(),
                            periodEnd : currentPeriodEnd
                        }
                    })
                }
            }
        }
    }
)