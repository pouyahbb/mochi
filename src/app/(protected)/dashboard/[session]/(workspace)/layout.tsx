import Navbar from '@/components/navbar'
import { SubscriptionEntitlementQuery } from '@/convex/query.config'
import { combineSlug } from '@/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children : React.ReactNode
    params : Promise<{ session : string }>
}

export default async function Layout({children , params} : Props) {
    const {profileName , entitlement} = await SubscriptionEntitlementQuery()
    const { session } = await params
    const expectedSlug = combineSlug(profileName!)
    
    if(!entitlement._valueJSON) {
        // Only redirect if we're not already on the correct route
        if(session !== expectedSlug) {
            return redirect(`/dashboard/${expectedSlug}`)
        }
    }

    return (
        <div className='grid grid-cols-1'>
            <Navbar />
            {children}
        </div>
    )
}