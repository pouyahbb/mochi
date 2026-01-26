"use client"

import { useProjectCreation } from '@/hooks/use-project'
import { useAppSelector } from '@/redux/store'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ProjectsList = () => {
    const { projects , canCreate } = useProjectCreation()
    const user = useAppSelector(state => state.profile)

    if(!canCreate){
        return (
            <div className='text-center py-12'>
                <p className="text-lg">Please sign in to view your projects.</p>
            </div>
        )
    }
    return (
        <div className='space-y-8'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-semibold text-foreground'>
                        Your Projects
                    </h1>
                    <p className='text-muted-foreground mt-2'>
                        Manage your design projects and continue where you left off.
                    </p>
                </div>
            </div>
            {projects.length === 0 ? (
                <div className="text-center py-20">
                    <div className='w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center'>
                        <Plus className='w-8 h-8 text-muted-foreground' />
                    </div>
                    <h3 className='text-lg font-medium text-foreground mb-6'>
                        No projects yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Create your first project to get started
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {projects.map((project : any) => (
                        <Link className="group cursor-pointer" href={`/dashboard/${user?.name}/canvas?project=${project._id}`} key={project._id}>
                            <div className='space-y-3'>
                                <div className="aspect-4/3 rounded-lg overflow-hidden bg-muted relative">
                                    {project.thumbnail ? (
                                        <img 
                                            src={project.thumbnail} 
                                            alt={project.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className='w-full h-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center'>
                                            <Plus className='w-8 h-8 text-gray-400' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectsList