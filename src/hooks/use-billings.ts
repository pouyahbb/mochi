import { useLazyGetCheckoutQuery } from "@/redux/api/billing"
import { useAppSelector } from "@/redux/store"
import { toast } from "sonner"

export const useSubscriptionPlan = () => {
    const [trigger , {isFetching}] = useLazyGetCheckoutQuery()
    const profile = useAppSelector(state => state.profile)
    const id = profile?.id
    const onSubscribe = async () => {
        if (!id) {
            toast.error("You need to be signed in to manage billing.")
            return
        }
        try{
            const res = await trigger(id).unwrap()
            window.location.href  = res.url
        }catch(err){
            console.log(err)
            toast.error("Could not start checkout. Please try again.")
        }
    }
    return {onSubscribe , isFetching}
}