"use client"

import { useInfiniteCanvas, useInspiration } from '@/hooks/use-canvas'
import React from 'react'
import TextSidebar from './text-sidebar'
import { cn } from '@/lib/utils'
import ShapeRenderer from './shapes'
import { RectanglePreview } from './shapes/rectangle/preview'
import { ArrowPreview } from './shapes/arrow/preview'
import { FramePreview } from './shapes/frame/preview'
import { EllipsePreview } from './shapes/ellipse/preview'
import { LinePreview } from './shapes/line/preview'
import { StrokePreview } from './shapes/stroke/preview'
import SelectionOverlay from './shapes/selection'
import InspirationSidebar from './shapes/inspiration-sidebar'

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

    const {isInspirationOpen , closeInspiration , toggleInspiration} = useInspiration()

    const draftShape = getDraftShape()
    const freeDrawPoints = getFreeDrawPoints()

    // Placeholder functions for generatedUI features
    const toggleChat = (generatedUIId: string) => {
        console.log("Toggle chat for:", generatedUIId)
        // TODO: Implement chat functionality
    }

    const generateWorkflow = (generatedUIId: string) => {
        console.log("Generate workflow for:", generatedUIId)
        // TODO: Implement workflow generation
    }

    const exportDesign = (generatedUIId: string, element: HTMLElement | null) => {
        console.log("Export design for:", generatedUIId, element)
        // TODO: Implement export functionality
    }

    return (
        <>
            <TextSidebar isOpen={isSidebarOpen && hasSelectedText} />
            <InspirationSidebar isOpen={isInspirationOpen} onClose={closeInspiration} />
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
                    {shapes.map(shape => (
                        <SelectionOverlay key={`selection-${shape.id}`} shape={shape} isSelected={!!selectedShapes[shape.id]} />
                    ))}
                    {draftShape && draftShape.type === "frame" && (
                        <FramePreview startWorld={draftShape.startWorld} currentWorld={draftShape.currentWorld}  />
                    )}
                    {draftShape && draftShape.type === "rect" && (
                        <RectanglePreview startWorld={draftShape.startWorld} currentWorld={draftShape.currentWorld}  />
                    )}
                    {draftShape && draftShape.type === "ellipse" && (
                       <EllipsePreview startWorld={draftShape.startWorld} currentWorld={draftShape.currentWorld}  />
                    )}
                    {draftShape && draftShape.type === "arrow" && (
                       <ArrowPreview startWorld={draftShape.startWorld} currentWorld={draftShape.currentWorld}  />
                    )}
                    {draftShape && draftShape.type === "line" && (
                       <LinePreview startWorld={draftShape.startWorld} currentWorld={draftShape.currentWorld}  />
                    )}
                    {currentTool === "freedraw" && freeDrawPoints.length > 1 && (
                        <StrokePreview points={freeDrawPoints} />
                    )}
                </div>
                
            </div>   
        </>
    )
}

export default InfiniteCanvas