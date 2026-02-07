import { ConsumeCreditsQuery, CreditBalanceQuery, InspirationImagesQuery, StyleGuideQuery } from "@/convex/query.config";
import { prompts } from "@/prompts";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    try{
        const body = await request.json()
        const {generatedUIId , currentHTML , projectId , pageIndex} = body
        if(!generatedUIId || !currentHTML || !projectId || pageIndex === undefined ){
            return NextResponse.json({
                error : "Missing required fields: generatedUIID , currentHTML , projectId , pageIndex"
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

        const inpirationResult = await InspirationImagesQuery(projectId)
        const images = inpirationResult.images._valueJSON as unknown as {
            url : string
        }[]
        const imagesUrl = images.map(img => img.url).filter(Boolean)
        const colors = (styleGuideData?.colorSections || []) as Array<{
            swatches: Array<{ name: string; hexColor: string; description: string }>
        }>
        const typography = (styleGuideData?.typographySections || []) as Array<{
            styles: Array<{ name: string; description: string; fontFamily: string; fontWeight: string; fontSize: string; lineHeight: string }>
        }>

        const pageTypes = [
            "Dashboard/Analytics page with charts, metrics, and KPIs",
            "Settings/Configuration page with preferences and account management",
            "User Profile page with personal information and activity",
            "Data Listing/Table page with search, filters, and pagination"
        ]
        const templateHints = [
            "Use the DASHBOARD template from the template library as your base",
            "Use the SETTINGS PAGE template from the template library as your base",
            "Use the PROFILE PAGE template from the template library as your base",
            "Use the DATA LISTING template from the template library as your base"
        ]
        const selectedPageType = pageTypes[pageIndex] || pageTypes[0]
        const selectedTemplateHint = templateHints[pageIndex] || templateHints[0]

        let userPrompt = `Create a "${selectedPageType}" workflow page that complements the main page design.

${selectedTemplateHint}. Customize the template slots with contextually appropriate content.

MAIN PAGE DESIGN (for style consistency — copy the exact <style> block):
${currentHTML.substring(0, 1500)}${currentHTML.length > 1500 ? '...' : ''}

REQUIREMENTS:
1. Use the EXACT same visual style, color scheme, and <style> block as the main page
2. Pick the recommended template and fill all {{placeholder}} slots
3. Use COMPONENT LIBRARY pieces for cards, tables, buttons, forms, etc.
4. Generate realistic content that fits the page type and application context
5. Maintain identical component styles (buttons, cards, forms, navigation)
`

        if(colors.length > 0){
            userPrompt += `\n\nCOLORS:\n${colors.map(color => color.swatches.map(swatch => `${swatch.name}: ${swatch.hexColor}`).join(", ")).join(", ")}`
        }
        if(typography.length > 0){
            userPrompt += `\n\nTYPOGRAPHY:\n${typography.map(typo => typo.styles.map(style => `${style.name}: ${style.fontFamily} ${style.fontWeight} ${style.fontSize}`).join(", ")).join(", ")}`
        }
        if(imagesUrl.length > 0){
            userPrompt += `\n\nINSPIRATION: ${imagesUrl.length} reference images available for visual style.`
        }

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
                        ...imagesUrl.map(url => ({
                            type : "image" as const,
                            image : url
                        }))
                    ]
                }
            ],
            system : prompts.workflow?.system || prompts.generativeUi.system,
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
        console.error("Workflow generation API error " , err)
        return NextResponse.json({
            error : "Failed to process workflow generation request",
            details : err instanceof Error ? err.message : "Unknown error"
        } , {
            status : 500
        })
    }
}
