import { ConsumeCreditsQuery, CreditBalanceQuery, InspirationImagesQuery, StyleGuideQuery } from "@/convex/query.config";
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
        const styleGuideData = styleGuide.styleGuide._valueJSON as unknown  as {
            colorSections : unknown[],
            typographySections : unknown[]
        }
        
        let userPrompt  = `CRITICAL : You are redesigner a SPECIFIC WORKFLOW PAGE, not creating a new page from scratch
        USER REQUEST : "${userMessage}

        CURRENT WORKFLOW PAGE HTML TO REDESIGN:
        1. MODIFY THE PROVIDED HTML ABOVE - do not create completely new page
        2. Apply the user's requested changes to the exisiting workflow page
        3. Keep the same page type and core structure and component hirerachy
        4. Maintain all functional elements while applying visual/content changes
        5. Keet the same general organization and workflow purpose

        MODIFICATION GUIDELINES : 
        1. Start with the provided HTML structure as your base
        2. Apply the requested changes (colors, layout, content , styling, etc.)
        3. Keep all exisiting IDs and semantic structure intact
        4. Maintain shadcn/ui component patterns and classes
        5. Preserve responsive design and accessibility features
        6. Update content, styling, or layout as requested but keep core structure

        IMPORTANT:
        - DO NOT generate a completely diffrent page
        - DO NOT revert to any "original" or "main" page design
        - DO redesign the specific workflow page shown in the HTML above
        - DO apply the user's change to that specific page


        colors : ${styleGuideData.colorSections.map((color:any) => color.swatches.map((swatch:any) => {
            return `${swatch.name}: ${swatch.hexColor}, ${swatch.description}`
        }).join(", ")).join(", ")}
        typography: ${styleGuideData.typographySections.map((typo:any) => typo.styles.map((style:any) => {
            return `${style.name}: ${style.description}, ${style.fontFamily}, ${style.fontWeight}, ${style.fontSize}, ${style.lineHeight}`
        }).join(", ")).join(", ")}

        Please generate the modified version of the provided workflow page HTML with the requested changes applied.
        `

        userPrompt += `\n\nPlease generate a professional redesigned workflow page that incorporates the requested changes while maintaining the core functionality and design consistency.`


        const result = streamText({
            model: anthropic("claude-opus-4-20250514"),
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
            system : prompts.generativeUi.system,
            temperature : 0.7
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
                "Cache-Controll" : "no-cache",
                Connection : "keep-alive"
            }
        })
    }catch(err){
        console.error("Workflow generation API error " , err)
        return NextResponse.json({
            error : "Failed to process workflow generation request",
            details : err instanceof Error ? err.message : "Unknown error"
        } , {
            status : 500
        })
    }
}