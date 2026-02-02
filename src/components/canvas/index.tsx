"use client"

import { useInfiniteCanvas } from '@/hooks/use-canvas'
import React from 'react'
import TextSidebar from './text-sidebar'
import { cn } from '@/lib/utils'
import ShapeRenderer from './shapes'

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

            <div 
                className={cn("relative w-full h-full overflow-hidden select-none z-0", {
                    "cursor-grabbing" : viewport.mode === "panning",
                    "cursor-grab" : viewport.mode ==="shiftpanning",
                    "cursor-crosshair" : currentTool !== "select" && viewport.mode === "idle",
                    "cursor-default" : currentTool === "select" && viewport.mode === "idle"
            })}
            aria-label="Infinite drawing canvas"
            role="application" 
            ref={attachCanvasRef}
            style={{touchAction : "none"}}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            >
                <div
                    style={{
                        transform : `translate3d(${viewport.translate.x}px, ${viewport.translate.y}px, 0) scale(${viewport.scale})`,
                        transformOrigin:"0 0",
                        willChange:"transform"
                    }} 
                    className="absolute origin-top-left pointer-events-none z-10"
                >
                    {shapes.map(shape => (
                        <ShapeRenderer  
                            key={shape.id}
                            shape={shape}
                            toggleInspiration={toggleInspiration}
                            toggleChat={toggleChat}
                            generateWorkflow={generateWorkflow}
                            exportDesign={exportDesign}
                        />
                    ))}
                </div>
                {/* should look 6:47:44 */}
            </div>   
        </>
    )
}

export default InfiniteCanvas