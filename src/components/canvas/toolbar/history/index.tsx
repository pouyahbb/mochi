"use client"
import { Redo2, Undo2 } from 'lucide-react'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { undo, redo } from '@/redux/slice/shapes'
import { cn } from '@/lib/utils'

const HistoryPill = () => {
    const dispatch = useAppDispatch()
    const history = useAppSelector(state => state.shapes.history)
    const canUndo = history.past.length > 0
    const canRedo = history.future.length > 0
    
    // Detect background color for toolbar adaptation
    const [isLightBackground, setIsLightBackground] = React.useState(false)
    
    React.useEffect(() => {
        const checkBackground = () => {
            const canvas = document.querySelector('[role="application"]') as HTMLElement
            if(!canvas) return
            
            const computedStyle = window.getComputedStyle(canvas)
            const bgColor = computedStyle.backgroundColor
            // Check if background is light (white/light colors)
            const rgb = bgColor.match(/\d+/g)
            if(rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0])
                const g = parseInt(rgb[1])
                const b = parseInt(rgb[2])
                // Calculate luminance
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

    const handleUndo = () => {
        if(canUndo) {
            dispatch(undo())
        }
    }

    const handleRedo = () => {
        if(canRedo) {
            dispatch(redo())
        }
    }

    return (
        <div className='col-span-1 flex justify-start items-center'>
            <div 
                aria-hidden 
                className={cn(
                    'inline-flex items-center rounded-full backdrop-blur-xl border saturate-150 transition-colors',
                    isLightBackground 
                        ? 'bg-black/20 border-black/30 text-black' 
                        : 'bg-white/8 border-white/12 text-white/80'
                )}
            >
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={cn(
                        'inline-grid h-8 w-8 md:h-9 md:w-9 place-items-center rounded-full transition-colors touch-manipulation',
                        canUndo 
                            ? isLightBackground 
                                ? 'hover:bg-black/30 active:bg-black/40 cursor-pointer' 
                                : 'hover:bg-white/12 active:bg-white/20 cursor-pointer'
                            : 'opacity-30 cursor-not-allowed'
                    )}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className='stroke-[1.75]' size={16} />
                </button>
                <span className={cn('mx-0.5 md:mx-1 h-4 md:h-5 w-px rounded', isLightBackground ? 'bg-black/20' : 'bg-white/16')} />
                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={cn(
                        'inline-grid h-8 w-8 md:h-9 md:w-9 place-items-center rounded-full transition-colors touch-manipulation',
                        canRedo 
                            ? isLightBackground 
                                ? 'hover:bg-black/30 active:bg-black/40 cursor-pointer' 
                                : 'hover:bg-white/12 active:bg-white/20 cursor-pointer'
                            : 'opacity-30 cursor-not-allowed'
                    )}
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo2 className='stroke-[1.75]' size={16} />
                </button>
            </div>
        </div>
    )
}
export default HistoryPill