import { ConsumeCreditsQuery, CreditBalanceQuery, InspirationImagesQuery, StyleGuideQuery } from "@/convex/query.config";
import { prompts } from "@/prompts";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    try{
        const body = await request.json()
        const {userMessage , generatedUIId ,currentHTML, projectId , wireframeSnapshot} = body
        if(!generatedUIId || !projectId || !userMessage ){
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
        const inpirationResult = await InspirationImagesQuery(projectId)
        const images = inpirationResult.images._valueJSON as unknown as {
            url : string
        }[]
        const imagesUrl = images.map(img => img.url).filter(Boolean)
        const colors = styleGuideData?.colorSections || []
        const typography = styleGuideData?.typographySections || []
        
        let userPrompt  = `Please redesign this UI based on my request : "${userMessage}"`

        if(currentHTML){
            userPrompt += `\n\nCurrent HTML for refrences:\n${currentHTML.substring(0 , 1000)}...`
        }

        if(wireframeSnapshot){
            userPrompt += `\n\nWireframe Context: I'm providing a wireframe image that shown the EXACT original design layout and structure that this UI was generated from.
            This wireframe represents the specific frame that was use to create the current design.Please use this as visual context to understand the intended layout, structure , and design elements when making improvments.
            The wireframe shows the original wireframe/mockup that the user drew or created.`
            console.log("using wireframe context for regeneration")
        }else{
            console.log("No wireframe context available - using text-only regeneration")
        }
        if(colors.length>0){
            userPrompt+= `\n\nStyle Guide Colors: \n${(
                colors as Array<{
                    swatches : Array<{
                        name : string
                        hexColor : string
                        description : string
                    }>
                }>
            ).map(color => color.swatches.map(swatch => `${swatch.name}: ${swatch.hexColor}, ${swatch.description}`).join(", ")).join(", ")}`
        }
        if(typography.length > 0){
            userPrompt += `\n\nTypography:\n${(
                    typography as Array<{
                        styles: Array<{
                            name : string
                            description : string
                            fontFamily : string
                            fontWeight : string
                            fontSize : string
                            lineHeight : string
                        }>
                    }>
                ).map(typo => typo.styles.map(style => `${style.name}:${style.description}, ${style.fontFamily}, ${style.fontWeight}, ${style.fontSize}, ${style.lineHeight}`).join(", ")).join(", ")
            }`
        }

        if(imagesUrl.length> 0){
            userPrompt += `\n\nInpiration Images Available: ${imagesUrl.length} refrence images for visual style and inspiration`
        }
        userPrompt += `\n\nPlease generate a completely new HTML design based on my request while following the style guide, maintaining professional quality,
        and considerating the wireframe context for layout understanding`



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
                        {
                            type : "image",
                            image : wireframeSnapshot
                        },
                        ...imagesUrl.map(url => ({
                            type : "image" as const,
                            image :url
                        }))
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