"use client"
import { Button } from '@/components/ui/button'
import { useInfiniteCanvas } from '@/hooks/use-canvas'
import { setScale } from '@/redux/slice/viewport'
import { ZoomIn, ZoomOut } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { cn } from '@/lib/utils'

const ZoomBar = () => {
    const {viewport } = useInfiniteCanvas()
    const dispatch = useDispatch()
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

    const handleZoomOut = () => {
        const newScale = Math.max(viewport.scale / 1.2 , viewport.minScale)
        dispatch(setScale({scale : newScale}))
    }
    const handleZoomIn = () => {
        const newScale = Math.min(viewport.scale * 1.2 , viewport.maxScale)
        dispatch(setScale({scale : newScale}))
    }
    
    return (
        <div className="col-span-1 flex justify-end items-center">
            <div className={cn(
                "flex items-center gap-0.5 md:gap-1 backdrop-blur-xl border rounded-full p-1.5 md:p-3 saturate-150 transition-colors",
                isLightBackground 
                    ? 'bg-black/20 border-black/30' 
                    : 'bg-white/8 border-white/12'
            )}>
                <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={handleZoomOut} 
                    className={cn(
                        "w-8 h-8 md:w-9 md:h-9 p-0 rounded-full cursor-pointer border border-transparent transition-all touch-manipulation",
                        isLightBackground
                            ? "hover:bg-black/30 active:bg-black/40 hover:border-black/40"
                            : "hover:bg-white/12 active:bg-white/20 hover:border-white/16"
                    )}
                    title="Zoom Out"
                >
                    <ZoomOut className={cn('w-3.5 h-3.5 md:w-4 md:h-4', isLightBackground ? 'text-black' : 'text-primary/50')} />
                </Button>
                <div className="text-center min-w-12 md:min-w-14">
                    <span className={cn("text-xs md:text-sm font-mono leading-none", isLightBackground ? 'text-black' : 'text-primary/50')}>
                        {Math.round(viewport.scale * 100)}%
                    </span>
                </div>
                <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={handleZoomIn} 
                    className={cn(
                        "w-8 h-8 md:w-9 md:h-9 p-0 rounded-full cursor-pointer border border-transparent transition-all touch-manipulation",
                        isLightBackground
                            ? "hover:bg-black/30 active:bg-black/40 hover:border-black/40"
                            : "hover:bg-white/12 active:bg-white/20 hover:border-white/16"
                    )}
                    title="Zoom In"
                >
                    <ZoomIn className={cn('w-3.5 h-3.5 md:w-4 md:h-4', isLightBackground ? 'text-black' : 'text-primary/50')} />
                </Button>
            </div>
        </div>
    )
}

export default ZoomBar