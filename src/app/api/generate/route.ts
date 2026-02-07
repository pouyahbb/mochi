import { ConsumeCreditsQuery, CreditBalanceQuery, InspirationImagesQuery, StyleGuideQuery } from "@/convex/query.config"
import { prompts } from "@/prompts"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req : NextRequest) => {
    try{
        const formData = await req.formData()
        const imageFile = formData.get("image") as File
        const projectId = formData.get("projectId") as string

        if(!imageFile){
            return NextResponse.json({error : "No image file provided"} , {status : 400})
        }
        if(!imageFile.type || !imageFile.type.startsWith("image/")){
            return NextResponse.json({error : "Invalid image file type. Only image allowed"} , {status : 400})
        }

        const {ok : balanceOk , balance : balanceBalance} = await CreditBalanceQuery()
        if(!balanceOk){
            return NextResponse.json({error : "Failed to get balance"} , {status : 500})
        }
        if(balanceBalance === 0){
            return NextResponse.json({error : "No credits available"} , {status : 400})
        }
        const {ok} = await ConsumeCreditsQuery({amount : 1})
        if(!ok){
            return NextResponse.json({error : "No credits available"} , {status : 400})
        }
        const imageBuffer = await imageFile.arrayBuffer()
        const base64String = Buffer.from(imageBuffer).toString("base64")
        const base64Image = `data:${imageFile.type};base64,${base64String}`
        const styleGuide = await StyleGuideQuery(projectId)
        const guide = styleGuide?.styleGuide?._valueJSON as unknown as {
            colorSections? : unknown[],
            typographySections? : unknown[],
        } | null | undefined

        const inspirationImages = await InspirationImagesQuery(projectId)
        const images = inspirationImages.images._valueJSON as unknown as {url : string}[]
        const imagesUrls = images.map(img => img.url).filter(Boolean)
        const colors = (guide?.colorSections || []) as Array<{
            swatches: Array<{ name: string; hexColor: string; description: string }>
        }>
        const typography = (guide?.typographySections || []) as Array<{
            styles: Array<{ name: string; fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; letterSpacing?: string; description: string }>
        }>
        const systemPrompt = prompts.generativeUi.system
        
        // Build a concise user prompt that references the component library
        let userPrompt = `Convert this wireframe into production-ready HTML using the COMPONENT LIBRARY and TEMPLATES provided in the system prompt.

INSTRUCTIONS:
1. Analyze the wireframe image to identify layout structure and components
2. Select the best matching PAGE TEMPLATE as your starting point
3. Use COMPONENT LIBRARY pieces for each UI element (buttons, cards, tables, etc.)
4. Apply the style guide colors to the .c-* classes in the <style> block
5. Fill in realistic content inspired by the wireframe and inspiration images
`

        if(colors.length > 0){
            userPrompt += `\n\nSTYLE GUIDE COLORS:\n${colors.map(color => color.swatches.map(swatch => `${swatch.name}: ${swatch.hexColor}`).join(", ")).join(", ")}`
        }
        if(typography.length > 0){
            userPrompt += `\n\nTYPOGRAPHY:\n${typography.map(t => t.styles.map(s => `${s.name}: ${s.fontFamily} ${s.fontSize} ${s.fontWeight}`).join(", ")).join(", ")}`
        }
        if(imagesUrls.length > 0){
            userPrompt += `\n\nINSPIRATION IMAGES: ${imagesUrls.length} reference images provided for visual style.`
        }

        const result = streamText({
            model : anthropic("claude-sonnet-4-20250514"),
            messages : [
                {
                    role : "user",
                    content : [
                        {
                            type : "text",
                            text: userPrompt
                        },
                        {
                            type: "image",
                            image : base64Image
                        },
                        ...imagesUrls.map(url => ({
                            type : "image" as const,
                            image : url as string
                        }))
                    ]
                }
            ],
            system : systemPrompt,
            temperature : 0.5,
        })
        const stream = new ReadableStream({
            async start(controller){
                try{
                    for await (const chunk of result.textStream){
                        const encoder = new TextEncoder()
                        controller.enqueue(encoder.encode(chunk))
                    }
                    controller.close()
                }catch(err){
                    console.error("Failed to generate design" , err)
                }
            }
        })
        return new Response(stream , {
            headers : {
                'Content-Type' : 'text/html; charset=utf-8',
                'Cache-Control' : 'no-cache',
                Connection : 'keep-alive',
            }
        })
    }catch(err){
        console.error(err)
        return NextResponse.json({error : "Failed to generate design" , details : err instanceof Error ? err.message : "Unknown error"} , {status : 500})
    }
}
