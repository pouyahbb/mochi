"use client"

import { Button } from '@/components/ui/button'
import { useSubscriptionPlan } from '@/hooks/use-billings'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

const SubscripionButton = () => {
    const {isFetching , onSubscribe} = useSubscriptionPlan()

    return (
        <Button 
            onClick={onSubscribe}
            type="button"
            disabled={isFetching}
            className={cn(
                "backdrop-blur-xl bg-white/8 border border-white/12" , 
                "saturate-150 rounded-full shadow-xl",
                "hover:bg-white/12 hover:border-white/16 trasition-all duration-200",
                "active:bg-white/6 active:scale-[0.98]",
                "focus:ouline-none focus:ring-2 focus:ring-white/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-white font-medium text-sm px-6 py-3"
            )}>
            {isFetching ? (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Redirecting...
                </>
            ) : (
                "Subscribe"
            )}
        </Button>
    )
}

export default SubscripionButton