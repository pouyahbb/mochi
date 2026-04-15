import { useAppSelector } from "@/redux/store"
import { toast } from "sonner"

export const useSubscriptionPlan = () => {
    const user = useAppSelector(state => state.profile.user)

    const onSubscribe = async () => {
        if (!user?.id) {
            toast.error("You need to be signed in to manage billing.")
            return
        }

        toast.info(
            "This is a demo/organizational build. No payment is required and all features are available for free."
        )
    }

    return { onSubscribe, isFetching: false }
}