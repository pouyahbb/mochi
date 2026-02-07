"use client"

import { useMutation, useQuery } from 'convex/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { CircleQuestionMark, Hash, LayoutTemplate, User, LogOut, Sparkles, Edit2, Check, X } from 'lucide-react'
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
import { useProjectCreation } from '@/hooks/use-project'
import { toast } from 'sonner'
import { updateProject } from '@/redux/slice/projects'
import { useAppDispatch } from '@/redux/store'

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
    const dispatch = useAppDispatch()
    const { createProject } = useProjectCreation()
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedName, setEditedName] = useState("")

    const projectId = params.get("project")
    const hasCanvas = pathname.includes("canvas")
    const hasStyleGuide = pathname.includes("style-guide")

        const me = useAppSelector(state => state.profile.user)

    const creditBalance = useQuery(api.subscription.getCreditBalance , me?.id ? { userId: me.id as Id<"users"> } : "skip")

    const project = useQuery(api.projects.getProject , projectId ? {projectId : projectId as Id<"projects">} : "skip")

    const updateProjectName = useMutation(api.projects.updateProjectName)

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

    const handleTabClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!projectId && me?.id) {
            e.preventDefault()
            try {
                const result = await createProject()
                if (result) {
                    const newHref = href.includes('project=') 
                        ? href.replace(/project=[^&]*/, `project=${result}`)
                        : `${href}${href.includes('?') ? '&' : '?'}project=${result}`
                    router.push(newHref)
                }
            } catch (err) {
                console.error("Failed to create project:", err)
                toast.error("Failed to create project")
            }
        }
    }

    const handleEditName = () => {
        if (project) {
            setEditedName(project.name || "")
            setIsEditingName(true)
        }
    }

    const handleSaveName = async () => {
        if (!projectId || !editedName.trim()) {
            setIsEditingName(false)
            return
        }
        try {
            await updateProjectName({
                projectId: projectId as Id<"projects">,
                name: editedName.trim()
            })
            const now = Date.now()
            dispatch(updateProject({
                _id: projectId,
                name: editedName.trim(),
                lastModified: now
            } as any))
            toast.success("Project name updated")
            setIsEditingName(false)
        } catch (err) {
            console.error("Failed to update project name:", err)
            toast.error("Failed to update project name")
        }
    }

    const handleCancelEdit = () => {
        setIsEditingName(false)
        setEditedName("")
    }

    const tabs:TabsProps[] = me ? [
        {
            label : "Canvas",
            href : `/dashboard/${me.name}/canvas?project=${projectId || ''}`,
            icon : <Hash className='h-4 w-4' />
        },
        {
            label : "Style Guide",
            href : `/dashboard/${me.name}/style-guide?project=${projectId || ''}`,
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
                {(!hasCanvas && !hasStyleGuide) || (project && (
                    <div className='lg:inline-flex hidden items-center gap-2 rounded-full text-primary/60 border border-white/12 backdrop-blur-xl bg-white/8 px-4 py-2 text-sm saturate-150'>
                        {isEditingName ? (
                            <div className='flex items-center gap-2'>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className='bg-transparent border-none outline-none text-white flex-1 min-w-[100px]'
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveName()
                                        } else if (e.key === 'Escape') {
                                            handleCancelEdit()
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSaveName}
                                    className='text-green-400 hover:text-green-300 transition'
                                >
                                    <Check className='w-3 h-3' />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className='text-red-400 hover:text-red-300 transition'
                                >
                                    <X className='w-3 h-3' />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span>Project / {project?.name || 'Untitled'}</span>
                                {project && (
                                    <button
                                        onClick={handleEditName}
                                        className='ml-2 text-white/50 hover:text-white transition'
                                    >
                                        <Edit2 className='w-3 h-3' />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className='lg:flex hidden items-center justify-center gap-2'>
                <div className='flex items-center gap-2 backdrop-blur-xl bg-white/8 border border-white/12 rounded-full p-2 saturate-150'>
                    {tabs.map(t => (
                        <Link 
                            key={t.href} 
                            href={t.href} 
                            onClick={(e) => handleTabClick(e, t.href)}
                            className={["group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition" , 
                                `${pathname}?project=${projectId || ''}` === t.href ? "bg-white/12 text-white border border-white/16 backdrop-blur-sm" : 
                                "text-zinc-400 hover:text-zinc-200 hover:bg-white/6 border border-transparent"
                            ].join(" ")}>
                            
                            <span className={
                                `${pathname}?project=${projectId || ''}` === t.href ? "opacity-100" : "opacity-70 group-hover:opacity-90"
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
                        <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl  border border-white/20 shadow-xl">
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