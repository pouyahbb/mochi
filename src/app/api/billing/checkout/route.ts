import { NextRequest, NextResponse } from "next/server"
import {Polar} from "@polar-sh/sdk"

export async function GET(req : NextRequest){
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userId")
    if(!userId){
        return NextResponse.json({error : "UserID is required"} , {status : 400})
    }

    const accessToken = process.env.POLAR_ACCESS_TOKEN
    const standardPlan = process.env.POLAR_STANDARD_PLAN

    if (!accessToken || !standardPlan) {
        console.error("Polar billing configuration missing. Check POLAR_ACCESS_TOKEN and POLAR_STANDARD_PLAN env vars.")
        return NextResponse.json(
            { error: "Billing is not configured. Please contact support." },
            { status: 500 }
        )
    }

    const polar = new Polar({
        server : process.env.POLAR_ENV === "sandbox"  ? "sandbox" : "production",
        accessToken
    })
    const session = await polar.checkouts.create({
        products : [standardPlan],
        successUrl : `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
        metadata : {
            userId
        }
    })
    return NextResponse.json({url : session.url })
}