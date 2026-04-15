import { SubscriptionEntitlementQuery } from '@/convex/query.config'
import { combineSlug } from '@/lib/utils'
import { redirect } from 'next/navigation'

const Page = async () => {
    const { profileName } = await SubscriptionEntitlementQuery()
    if (!profileName) {
        redirect("/auth/sign-in")
    }
    redirect(`/dashboard/${combineSlug(profileName)}`)
}

export default Page