"use client"

import { fetchProjectsSuccess } from '@/redux/slice/projects'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import React, { useEffect, useRef } from 'react'

type Props = {
    children : React.ReactNode
    initialProjects : any
}

const ProjectProviders = ({children , initialProjects} : Props) => {
    const dispatch = useAppDispatch()
    const hasInitialized = useRef(false)
    const projectsInStore = useAppSelector(state => state.projects.projects)
    const lastFetched = useAppSelector(state => state.projects.lastFetched)

    useEffect(() => {
        // Only fetch if:
        // 1. We haven't initialized yet AND store is empty, OR
        // 2. It's been more than 5 minutes since last fetch (to sync with server)
        // This prevents overwriting local changes when navigating back to the page
        const shouldFetch = (!hasInitialized.current && projectsInStore.length === 0) || 
                           (lastFetched && Date.now() - lastFetched > 300000)
        
        if(initialProjects?._valueJSON && shouldFetch){
            const projectsData = initialProjects._valueJSON
            dispatch(fetchProjectsSuccess({
                projects : projectsData , 
                total : projectsData.length
            }))
            hasInitialized.current = true
        }
    } , [dispatch , initialProjects, lastFetched, projectsInStore.length])

    return (
        <>
            {children}
        </>
    )
}

export default ProjectProviders