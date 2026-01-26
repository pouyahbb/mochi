"use client"

import { fetchProjectsSuccess } from '@/redux/slice/projects'
import { useAppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'

type Props = {
    children : React.ReactNode
    initialProjects : any
}

const ProjectProviders = ({children , initialProjects} : Props) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(initialProjects?._valueJSON){
            const projectsData = initialProjects._valueJSON
            dispatch(fetchProjectsSuccess({
                projects : projectsData , 
                total : projectsData.length
            }))
        }
    } , [dispatch , initialProjects])

    return (
        <>
            {children}
        </>
    )
}

export default ProjectProviders