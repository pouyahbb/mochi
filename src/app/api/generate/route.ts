import { ConsumeCreditsQuery, CreditBalanceQuery, InspirationImagesQuery, StyleGuideQuery } from "@/convex/query.config"
import { prompts } from "@/prompts"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req : NextRequest) => {
    try{
        const formData = await req.formData()
        const imageFile = formData.get("image") as File
        const projectId = formData.get("projectId") as string

        if(!imageFile){
            return NextResponse.json({error : "No image file provided"} , {status : 400})
        }
        if(imageFile.type.startsWith("image/")){
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
        const base64Image = Buffer.from(imageBuffer).toString("base64")
        const styleGuide = await StyleGuideQuery(projectId)
        const guide = styleGuide.styleGuide._valueJSON as unknown as {
            colorSections : string[],
            typographySections : string[],
        } 

        const inspirationImages = await InspirationImagesQuery(projectId)
        const images = inspirationImages.images._valueJSON as unknown as {url : string}[]
        const imagesUrls = images.map(img => img.url).filter(Boolean)
        const colors = guide.colorSections || []
        const typography = guide.typographySections || []
        const systemPrompt = prompts.generativeUi.system
        const userPrompt = `
            Use the user-provided styleGuide for all visual decisions: map its colors , typography scale , spacing and radii directly to Tailwind v4 utilities (use arbitrary color classes like text-[#RRGGBB] / bg-[#RRGGBB] when hexes are given),
            enforce WCAG AA contrast (>=4.5.1 body, >3:1 large text) , and if any token is missing fall back to natural light default. Never invert new tokens; Keep usage consistent across components.

            Inspiration images (URLs):
            You will receive up to 6 image URLs in images[].

            Use them only for interpretation (mood/keywords/subject matter) to bias choices within the existing StyleGuide tokens(e.g., which primary/secondary to emphasize, where accent appears, light vs. dark sections).

            Do not derive new colors or fonts from images; do not create tokens that aren't in StyleGuide.

            Do not echo the URLs in the output JSON: use them purely as inspiration.

            If an image URL is unreachable/invalid , ignore it without degrading output quality.

            If images  imply low-contrast contexts, adjust class pairings (e.g., text-[#ffffff] on bg-[#0A0A0A], stronger border/ring from tokens) to maintain accessibility while staying inside the StyleGuide.

            For any required illustrative slots, use a public placeholder image(deterministic seed) only if the schema requires an image field; otherwise don't include images in the JSON.

            on conflicts: the StyleGuide always wins over image uses.
        `

    }catch(err){
        console.error(err)
        return NextResponse.json({error : "Failed to generate design"} , {status : 500})
    }
}

// should look 10:28:18