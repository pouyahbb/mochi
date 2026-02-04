import { NextRequest, NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks'
import { isPolarWebhookEvent, PolarWebhookEvent } from "@/types/polar";
import { inngest } from "@/app/inngest/client";

export async function POST(req : NextRequest) : Promise<NextResponse> {
    console.log("==============================================")
    console.log("=== POLAR WEBHOOK ENDPOINT HIT ===")
    console.log("==============================================")
    console.log("Timestamp:", new Date().toISOString())
    console.log("URL:", req.url)
    
    const secret = process.env.POLAR_WEBHOOK_SECRET ?? ""
    if(!secret) {
        console.error("POLAR_WEBHOOK_SECRET is missing!")
        return new NextResponse("Missing POLAR_WEBHOOK_SECRET" , {status : 400})
    }
    console.log("POLAR_WEBHOOK_SECRET is configured (length:", secret.length, ")")
    
    const raw = await req.arrayBuffer()
    console.log("Raw body length:", raw.byteLength)
    
    // Log raw body for debugging
    const rawText = new TextDecoder().decode(raw)
    console.log("Raw body preview:", rawText.substring(0, 500))
    
    const headerObject = Object.fromEntries(req.headers)
    console.log("Webhook Headers:", JSON.stringify({
        'webhook-id': headerObject['webhook-id'],
        'webhook-timestamp': headerObject['webhook-timestamp'],
        'webhook-signature': headerObject['webhook-signature']?.substring(0, 50) + '...'
    }, null, 2))

    let verified : unknown
    try{
        console.log("Validating webhook signature...")
        verified = validateEvent(Buffer.from(raw) , headerObject, secret)
        console.log("Webhook signature validated successfully")
    }catch(err){
        console.error("=== WEBHOOK VALIDATION FAILED ===")
        console.error("Error:", err)
        if(err instanceof WebhookVerificationError){
            return new NextResponse("Invalid signature" , {status : 403})
        }
        throw err
    }
    
    if(!isPolarWebhookEvent(verified)){
        console.error("Event shape is not valid Polar webhook")
        return new NextResponse("Unsupported event shape" , {status : 400})
    }
    
    const evt:PolarWebhookEvent = verified
    const id = String(evt.id ?? Date.now())

    console.log("=== POLAR WEBHOOK RECEIVED ===")
    console.log("Event ID:", id)
    console.log("Event Type:", evt.type)
    console.log("Event Data:", JSON.stringify(evt, null, 2))

    try{    
        console.log("Sending event to Inngest: polar/webhook.received")
        const result = await inngest.send({
            name : "polar/webhook.received",
            id,
            data : evt
        })
        console.log("Inngest send result:", JSON.stringify(result, null, 2))
        console.log("Event sent successfully to Inngest")
    }catch(err){
        console.error("=== FAILED TO SEND TO INNGEST ===")
        console.error("Error:", err)
        console.error("Error details:", JSON.stringify(err, null, 2))
        return new NextResponse("Failed to process webhook" , {status : 500})
    }
    
    console.log("=== WEBHOOK PROCESSING COMPLETE ===")
    return NextResponse.json({ok : true})
}
