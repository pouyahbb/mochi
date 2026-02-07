"use client"

import { useQuery } from 'convex/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { CircleQuestionMark, Hash, LayoutTemplate, User, LogOut, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAppSelector } from '@/redux/store'
import CreateProject from '../buttons/project'
import Autosave from '../canvas/autosave'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useAuthActions } from '@convex-dev/auth/react'
import { combineSlug } from '@/lib/utils'

type TabsProps = {
    label : string
    href  : string
    icon?: React.ReactNode
}

const Navbar = () => {
    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useAuthActions()

    const projectId = params.get("project")
    const hasCanvas = pathname.includes("canvas")
    const hasStyleGuide = pathname.includes("style-guide")

    const me = useAppSelector(state => state.profile.user)

    const creditBalance = useQuery(api.subscription.getCreditBalance , me?.id ? { userId: me.id as Id<"users"> } : "skip")

    const project = useQuery(api.projects.getProject , projectId ? {projectId : projectId as Id<"projects">} : "skip")

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/auth/sign-in")
        } catch (err) {
            console.error("Failed to sign out:", err)
        }
    }

    const handleUpgradeAccount = () => {
        if(me?.name) {
            router.push(`/billing/${combineSlug(me.name)}`)
        }
    }


    const tabs:TabsProps[] = me ? [
        {
            label : "Canvas",
            href : `/dashboard/${me.name}/canvas?project=${projectId}`,
            icon : <Hash className='h-4 w-4' />
        },
        {
            label : "Style Guide",
            href : `/dashboard/${me.name}/style-guide?project=${projectId}`,
            icon : <LayoutTemplate className='h-4 w-4' />
        }
    ] : []

    if (!me) {
        return null
    }

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50'>
            <div className='flex items-center gap-4'>
                <Link href={`/dashboard/${me.name}`} className='w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center'>
                    <div className='w-4 h-4 rounded-full bg-white'></div>
                </Link>
                {!hasCanvas || (!hasStyleGuide && (
                    <div className='lg:inline-block hidden rounded-full text-primary/60 border border-white/12 backdrop-blur-xl bg-white/8 px-4 py-2 text-sm saturate-150 '>
                        Project / {project?.name}
                    </div>
                ))}
            </div>
            <div className='lg:flex hidden items-center justify-center gap-2'>
                <div className='flex items-center gap-2 backdrop-blur-xl bg-white/8 border border-white/12 rounded-full p-2 saturate-150'>
                    {tabs.map(t => (
                        <Link key={t.href} href={t.href} className={["group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition" , 
                            `${pathname}?project=${projectId}` === t.href ? "bg-white/12 text-white border border-white/16 backdrop-blur-sm" : 
                            "text-zinc-400 hover:text-zinc-200 hover:bg-white/6 border border-transparent"
                        ].join(" ")}>
                        
                            <span className={
                                `${pathname}?project=${projectId}` === t.href ? "opacity-100" : "opacity-70 group-hover:opacity-90"
                            }>
                                {t.icon}
                            </span>
                            <span> {t.label} </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='flex items-center gap-4 justify-end'>
                    <span className='text-sm text-white/50'> {creditBalance} credits </span>
                    <Button className='rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white/8 border border-white/12 saturate-150 hover:bg-white/12' variant="secondary">
                        <CircleQuestionMark className='size-5 text-white' />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className='cursor-pointer'>
                                <Avatar className='size-12 ml-2 hover:ring-2 hover:ring-white/20 transition-all'>
                                    <AvatarImage src={me.image || ""} />
                                    <AvatarFallback>
                                        <User className='size-5 text-white' />
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-white/95 border border-white/20 shadow-xl">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">{me.name || "User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{me.email || ""}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleUpgradeAccount}
                                className="cursor-pointer"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                <span>Upgrade Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleSignOut}
                                variant="destructive"
                                className="cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {hasCanvas && <Autosave />}
                    {!hasCanvas && !hasStyleGuide && <CreateProject />} 
            </div>
        </div>
    )
}

export default Navbar