"use client"
import { Button } from '@/components/ui/button'
import { useInfiniteCanvas } from '@/hooks/use-canvas'
import { cn } from '@/lib/utils'
import { Tool } from '@/redux/slice/shapes'
import { ArrowRight, Circle, Eraser, Hash, Minus, MousePointer2, Pencil, Square, Type } from 'lucide-react'
import React from 'react'

const tools : Array<{
    id : Tool
    icon : React.ReactNode
    label : string
    description : string
}> = [
    {
        id : "select",
        icon : <MousePointer2 className='w-4 h-4' />,
        label : "Select",
        description : "Select and move shapes"
    },
    {
        id : "frame",
        icon : <Hash className='w-4 h-4' />,
        label : "Frame",
        description : "Draw frame containers"
    },
    {
        id : "rect",
        icon : <Square className='w-4 h-4' />,
        label : "Rectangle",
        description : "Draw rectangles"
    },
    {
        id : "ellipse",
        icon : <Circle className='w-4 h-4' />,
        label : "Ellipse",
        description : "Draw ellipse and circles"
    },
    {
        id : "freedraw",
        icon : <Pencil className='w-4 h-4' />,
        label : "Free Draw",
        description : "Draw freehand lines"
    },
    {
        id : "arrow",
        icon : <ArrowRight className='w-4 h-4' />,
        label : "Arrow",
        description : "Draw arrows with direction"
    },
    {
        id : "line",
        icon : <Minus className='w-4 h-4' />,
        label : "Line",
        description : "Draw straight lines"
    },
    {
        id : "text",
        icon : <Type className='w-4 h-4' />,
        label : "Text",
        description : "Add text blocks"
    },
    {
        id : "eraser",
        icon : <Eraser className='w-4 h-4' />,
        label : "Eraser",
        description : "Remove shapes"
    },
]

const ToolbarShapes = ()=> {
    const {currentTool , selectTool} = useInfiniteCanvas()
    const [isLightBackground, setIsLightBackground] = React.useState(false)
    
    React.useEffect(() => {
        const checkBackground = () => {
            const canvas = document.querySelector('[role="application"]') as HTMLElement
            if(!canvas) return
            
            const computedStyle = window.getComputedStyle(canvas)
            const bgColor = computedStyle.backgroundColor
            const rgb = bgColor.match(/\d+/g)
            if(rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0])
                const g = parseInt(rgb[1])
                const b = parseInt(rgb[2])
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                setIsLightBackground(luminance > 0.5)
            }
        }
        
        checkBackground()
        const observer = new MutationObserver(checkBackground)
        const canvas = document.querySelector('[role="application"]')
        if(canvas) {
            observer.observe(canvas, { attributes: true, attributeFilter: ['style', 'class'] })
        }
        
        return () => observer.disconnect()
    }, [])

    return (
        <div className='col-span-1 flex justify-center items-center'>
            <div className={cn(
                'flex items-center backdrop-blur-xl backdrop-[url("#displacementFilter")] border gap-1 md:gap-2 rounded-full p-1.5 md:p-3 saturate-150 overflow-x-auto scrollbar-hide max-w-full transition-colors',
                isLightBackground 
                    ? 'bg-black/20 border-black/30' 
                    : 'bg-white/8 border-white/12'
            )}>
                {tools.map(tool => (
                    <Button
                    key={tool.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => selectTool(tool.id)}
                    title={`${tool.label} - ${tool.description}`}
                    className={cn(
                        "cursor-pointer rounded-full p-2 md:p-3 shrink-0 border transition-colors",
                        currentTool === tool.id 
                            ? isLightBackground
                                ? "text-black bg-black/30 border-black/40"
                                : "text-primary bg-white/12 border-white/16"
                            : isLightBackground
                                ? "text-black/70 hover:bg-black/20 border-transparent"
                                : "text-primary/50 hover:bg-white/6 border-transparent"
                    )}>
                        <span className="w-4 h-4 md:w-5 md:h-5">{tool.icon}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ToolbarShapes