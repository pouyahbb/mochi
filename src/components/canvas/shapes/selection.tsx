import { Shape } from '@/redux/slice/shapes'
import React from 'react'

interface SelectionOverlayProps {
    shape : Shape
    isSelected : boolean
}

const SelectionOverlay = ({isSelected ,shape} : SelectionOverlayProps) => {
    if(!isSelected) return null

    const getBounds = () => {
        switch(shape.type){
            case "frame":
            case "rect":
            case "ellipse":
            case "generatedui": 
                return{
                    x : shape.x,
                    y : shape.y,
                    w : shape.w,
                    h : shape.h
                }
            case "freedraw":
                if(shape.points.length === 0 ) return {x : 0 , y : 0 , w : 0 , h : 0}
                const xs = shape.points.map(p => p.x)
                const ys = shape.points.map(p => p.y)
                const minX = Math.min(...xs)
                const maxX = Math.max(...xs)
                const minY = Math.min(...ys)
                const maxY = Math.min(...ys)
                return {
                    x : minX - 5 , 
                    y : minY - 5,
                    w : maxX - minX + 10,
                    h : maxY - minY + 10
                }
            case "arrow":
            case "line":
                const lineMinX = Math.min(shape.startX , shape.endX)
                const lineMaxX = Math.max(shape.startX , shape.endX)
                const lineMinY = Math.min(shape.startY , shape.endY)
                const lineMaxY = Math.max(shape.startY , shape.endY)
                return {
                    x : lineMinX - 5,
                    y : lineMinY - 5,
                    w : lineMaxX - lineMinX + 10,
                    h : lineMaxY - lineMinY + 10
                }
            case "text":
                const textWidth = Math.max(shape.text.length * (shape.fontSize * 0.6), 100)
                const textHeight = shape.fontSize * 1.2
                const paddingX = 8
                const paddingY = 4
                return {
                    x : shape.x - 2 ,
                    y : shape.y - 2,
                    w : textWidth + paddingX + 4,
                    h : textHeight + paddingY + 4
                }
            default:
                return {x : 0 , y : 0 , w : 0 , h : 0}
        }
    }
    const bounds = getBounds()
    const isResizable = shape.type === "rect" || shape.type === "frame" || shape.type === "ellipse" || shape.type === "freedraw" || shape.type === "line" || shape.type === "arrow"
    
    const handlePointerDown = (e : React.PointerEvent , corner: string) => {
        e.stopPropagation()
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        const event = new CustomEvent("shape-resize-start", {
            detail : {shapeId : shape.id , corner , bounds}
        })
        window.dispatchEvent(event)
    }
    const handlePointerMove = (e : React.PointerEvent , corner : string) => {
        if((e.target as HTMLElement).hasPointerCapture(e.pointerId)){
            const event  = new CustomEvent("shape-resize-move" , {
                detail : {
                    shapeId : shape.id,
                    corner , 
                    clientX : e.clientX,
                    clientY : e.clientY,
                    bounds
                }
            })
            window.dispatchEvent(event)
        }
    }
    const handlePointerUp = (e: React.PointerEvent ) => {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
        const event = new CustomEvent("shape-resize-end" , {
            detail : {shapeId : shape.id}
        })
        window.dispatchEvent(event)
    }

  return (
    <div 
        style={{
            left : bounds.x - 2,
            top : bounds.y - 2,
            width : bounds.w + 4,
            height : bounds.h + 4,
            borderRadius : shape.type === "frame" ? "10px" : "4px"
        }}
        className='absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10'
    >
        {isResizable && (
            <>
                <div
                    style={{
                        top : -6,
                        left : -6
                    }}
                    onPointerDown={(e) => handlePointerDown(e , "nw")}
                    onPointerMove={(e) => handlePointerMove(e , "nw")}
                    onPointerUp={handlePointerUp }

                    className='absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize pointer-events-auto'
                />
                <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ns-resize pointer-events-auto"
                style={{
                    top : -6,
                    right : - 6
                }}
                onPointerDown={(e) => handlePointerDown(e , "ne")}
                onPointerMove={(e) => handlePointerMove(e , "ne")}
                onPointerUp={handlePointerUp }
                />
                <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize pointer-events-auto"
                style={{
                    bottom : -6,
                    left : -6
                }}
                onPointerDown={(e) => handlePointerDown(e , "sw")}
                onPointerMove={(e) => handlePointerMove(e , "sw")}
                onPointerUp={handlePointerUp }
                />
                <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize pointer-events-auto"
                style={{
                    bottom : -6,
                    right : -6
                }}
                onPointerDown={(e) => handlePointerDown(e , "se")}
                onPointerMove={(e) => handlePointerMove(e , "se")}
                onPointerUp={handlePointerUp }
                />
            </>
        )}    
        {!isResizable && (
            <>
                <div className='absolute w-2 h-2 bg-blue-500 border border-white rounded-full  -top-1  -left-1' />
                <div className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -top-1 -right-1" />
                <div className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -bottom-1 -left-1" />
                <div className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -bottom-1 -right-1" />
            </>
        )}
    </div>
  )
}

export default SelectionOverlay
