import { inngest } from "../../../app/inngest/client";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const INNGEST_RETRY_COOLDOWN_MS = 60_000
let inngestDisabledUntil = 0
let hasLoggedInngestBypass = false

interface UpdateProjectRequest {
    projectId : string
    shapesData : {
        tool : string
        selected : Record<string,unknown>
        frameCounter : number
    }
    viewportData?: {
        scale: number
        translate : {x : number , y : number}
    }
}

export async function PATCH(request : NextRequest){
    try{
        const body: UpdateProjectRequest & {userId?:string} =await request.json()
        const {projectId , shapesData , viewportData , userId} = body
        if(!projectId || !userId || !shapesData){
            return NextResponse.json({error : "Project ID, User ID and shapes data are required"} , {status : 400})
        }

        let eventId: string | null = null
        let queuedWithInngest = false
        const canTryInngest = Date.now() >= inngestDisabledUntil

        if (canTryInngest) {
            try {
                const eventResult = await inngest.send({
                    name : "project/autosave.requested",
                    data : {projectId , userId , shapesData , viewportData}
                })
                eventId = eventResult.ids[0] ?? null
                queuedWithInngest = true
                hasLoggedInngestBypass = false
            } catch (ingestError) {
                inngestDisabledUntil = Date.now() + INNGEST_RETRY_COOLDOWN_MS
                if (!hasLoggedInngestBypass) {
                    console.warn(
                        `Inngest unavailable, autosave fallback enabled for ${INNGEST_RETRY_COOLDOWN_MS / 1000}s.`,
                        ingestError
                    )
                    hasLoggedInngestBypass = true
                }
            }
        }

        if (!queuedWithInngest) {
            // In local/dev, Inngest may be unavailable. Save directly to keep autosave reliable.
            await fetchMutation(api.projects.updateProjectSketches, {
                projectId: projectId as Id<"projects">,
                sketchesData: shapesData,
                viewportData
            })
        }

        return NextResponse.json({
            success : true,
            message : queuedWithInngest ? "Project autosave initiated" : "Project autosaved directly",
            eventId
        })
    }catch(err){
        console.log(err)
        return NextResponse.json({
            error : "Failed to autosave project",
            message : err instanceof Error ? err.message : "Unknown error"
        } , {status: 500})
    }
}