"use client"

import { useInfiniteCanvas } from '@/hooks/use-canvas'
import React from 'react'
import TextSidebar from './text-sidebar'

const InfiniteCanvas = () => {
    const {
        attachCanvasRef ,  
        currentTool ,
        getDraftShape , 
        getFreeDrawPoints , 
        hasSelectedText ,
        isSidebarOpen ,
        onPointerCancel ,
        onPointerDown ,
        onPointerMove , 
        onPointerUp ,
        selectTool , 
        selectedShapes ,
        setIsSidebarOpen , 
        shapes ,
        viewport 
    } = useInfiniteCanvas()

    return (
        <>
            <TextSidebar isOpen={isSidebarOpen && hasSelectedText} />    
        </>
    )
}

export default InfiniteCanvas