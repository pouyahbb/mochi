import { fetchMutation, fetchQuery } from "convex/nextjs";
import { inngest } from "./client";
import { api } from "../../../convex/_generated/api";
import { extractOrderLike, extractSubscriptionLike, isEntitledStatus, isPolarWebhookEvent, PolarOrder, PolarSubscription, RecievedEvent, toMs } from "@/types/polar";
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
    return periodEndMs !== null ? `${subId}:${periodEndMs}` : eventId !== null ? `${subId}:evt:${eventId}` : `${subId}:first`
}

export const handlePolarEvent = inngest.createFunction(
    {id : "polar-webhook-handler"} , 
    {event : "polar/webhook.recieved"},
    async({event , step}) => {
        console.log("Inngest starting polar webhook handler" , JSON.stringify(event.data , null , 2))
        if(!isPolarWebhookEvent(event.data)){
            return 
        }
        const incomming = event.data as RecievedEvent
        const type = incomming.type
        const dataUnknown = incomming.data

        const sub : PolarSubscription | null  = extractSubscriptionLike(dataUnknown)
        const order: PolarOrder | null = extractOrderLike(dataUnknown)
        if(!sub && !order){
            return 
        }
        const userId :Id<"users"> | null = await step.run("resolve-user" , async () => {
            const metaUserId = (sub?.metadata?.userId as string | undefined) ?? (order?.metadata?.userId as string | undefined)
            if(metaUserId){
                console.log("Inngest , using metadata userId")
                return metaUserId as unknown as Id<"users">
            }
            const email = sub?.customer?.email ?? order?.customer?.email ?? null
            console.log("inngest, customer email " , email)
            if(email){
                try{
                    console.log('inngest , looking up user by email' , email)
                    const foundUserId = await fetchQuery(api.user.getUserIdByEmail  , {
                        email
                    })
                    return foundUserId
                }catch(err){
                    console.log("inngest , Failed to resolve email" , err)
                    return null
                }
            }
        })
        console.log("Inngest , Final resolve userId" , userId)
        if(!userId){
            console.log("Inngest , no user id resolved. skipping webhook process")
            return 
        }
        const polarSubscriptionId = sub?.id ?? order?.subscription_id ?? ""
        if(!polarSubscriptionId){
            console.log("inngest , no polar subscription id found. skipping")
            return
        }
        const currentPeriodEnd = toMs(sub?.current_period_end)
        const payload = {
            userId,
            // Ensure required string for Convex arg; fall back to empty string if missing
            polarCustomerId : sub?.customer?.id ?? sub?.customer_id ?? "",
            polarSubscriptionId,
            productId : sub?.product_id ?? sub?.product?.id ?? undefined,
            priceId : sub?.prices?.[0]?.id ?? undefined,
            planCode : sub?.plan_code ?? sub?.product?.name ?? undefined,
            status : sub?.status ?? "updated",
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
        const looksCreate = /subscription\.created/i.test(type)
        const looksRenew = /subscription\.renew|order\.created|invoice\.paid|order\.paid/i.test(type)
        const entitled = isEntitledStatus(payload.status)
        console.log("INNGEST , credit granting analysis : ")
        console.log(" - Event type: " , type)
        console.log(" - Loos like create: " , looksCreate)
        console.log(" - Loos like renew: " , looksRenew)
        console.log(" - User entitled : " ,entitled)
        console.log(" - Status:" , payload.status)

        const idk = grantKey(polarSubscriptionId , currentPeriodEnd , incomming.id)

        console.log("INNGEST , Idempotency key : " , idk)
        if(entitled && (looksCreate || looksRenew || true)){
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
                    statis : payload.status,
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