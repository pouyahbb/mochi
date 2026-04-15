"use client"

import { useQuery } from "convex/react"
import { useEffect } from "react"
import { api } from "../../convex/_generated/api"
import { ConvexUserRaw, normalizeProfile } from "@/types/user"
import { clearProfile, setProfile } from "./slice/profile"
import { useAppDispatch } from "./store"

const ProfileSync = () => {
    const dispatch = useAppDispatch()
    const me = useQuery(api.user.getCurrentUser, {})

    useEffect(() => {
        // undefined means Convex is still loading current auth state.
        if (me === undefined) return

        if (me === null) {
            dispatch(clearProfile())
            return
        }

        const normalized = normalizeProfile(me as unknown as ConvexUserRaw)
        dispatch(setProfile(normalized))
    }, [me, dispatch])

    return null
}

export default ProfileSync
