import { ConsumeCreditsQuery, CreditBalanceQuery, StyleGuideQuery } from "@/convex/query.config";
import { prompts } from "@/prompts";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    try{
        const body = await request.json()
        const {userMessage , generatedUIId ,currentHTML, projectId} = body
        if(!generatedUIId || !currentHTML || !projectId || !userMessage ){
            return NextResponse.json({
                error : "Missing required fields: generatedUIID , currentHTML , projectId , userMessage"
            } , {status : 400})
        }
        const {ok : balanceOk , balance: balanceBalance} = await CreditBalanceQuery()
        if(!balanceOk || balanceBalance === 0){
            return NextResponse.json({
                error : "No credits found"
            } , {status : 400})
        } 
        const {ok} = await ConsumeCreditsQuery({amount : 1})
        if(!ok){
            return NextResponse.json({
                error : "Failed to consume credits"
            } , {status : 500})
        }
        const styleGuide = await StyleGuideQuery(projectId)
        const styleGuideData = styleGuide?.styleGuide?._valueJSON as unknown as {
            colorSections?: unknown[]
            typographySections?: unknown[]
        } | null | undefined
        const colors = (styleGuideData?.colorSections || []) as Array<{
            swatches: Array<{ name: string; hexColor: string; description: string }>
        }>
        const typography = (styleGuideData?.typographySections || []) as Array<{
            styles: Array<{ name: string; description: string; fontFamily: string; fontWeight: string; fontSize: string; lineHeight: string }>
        }>
        
        // Concise prompt — component library is in the system prompt
        let userPrompt = `REDESIGN this workflow page based on user request: "${userMessage}"

MODIFY the provided HTML — do NOT create a completely different page.
Use COMPONENT LIBRARY pieces for any NEW elements you add.
Keep existing IDs, structure, and .c-* color system.

CURRENT WORKFLOW HTML TO MODIFY:
${currentHTML.substring(0, 2000)}${currentHTML.length > 2000 ? '...' : ''}`

        if(colors.length > 0){
            userPrompt += `\n\nCOLORS:\n${colors.map(color => color.swatches.map(swatch => `${swatch.name}: ${swatch.hexColor}`).join(", ")).join(", ")}`
        }
        if(typography.length > 0){
            userPrompt += `\n\nTYPOGRAPHY:\n${typography.map(typo => typo.styles.map(style => `${style.name}: ${style.fontFamily} ${style.fontWeight} ${style.fontSize}`).join(", ")).join(", ")}`
        }

        userPrompt += `\n\nGenerate the modified workflow page HTML with the requested changes applied.`

        const result = streamText({
            model: anthropic("claude-sonnet-4-20250514"),
            messages  : [
                {
                    role : "user",
                    content : [
                        {
                            type : "text",
                            text : userPrompt
                        },
                    ]
                }
            ],
            system : prompts.redesign.system,
            temperature : 0.5
        })

        const stream = new ReadableStream({
            async start (controller) {
                try{
                    for await (const chunk of result.textStream){
                        const encoder = new TextEncoder()
                        controller.enqueue(encoder.encode(chunk))
                    }
                    controller.close()
                }catch(err){
                    controller.error(err)
                }
            }
        })
        return new Response(stream,{
            headers : {
                'Content-Type': 'text/html; charset=utf-8',
                "Cache-Control" : "no-cache",
                Connection : "keep-alive"
            }
        })
    }catch(err){
        console.error("Workflow redesign API error" , err)
        return NextResponse.json({
            error : "Failed to process workflow redesign request",
            details : err instanceof Error ? err.message : "Unknown error"
        } , {
            status : 500
        })
    }
}
