"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { TextShape, updateShape } from '@/redux/slice/shapes'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import React from 'react'
import { Label } from 'recharts'

type Props = {isOpen : boolean}

const TextSidebar = ({isOpen} : Props) => {
    const selectedShapes = useAppSelector(state => state.shapes.selected)
    const shapesEntities = useAppSelector(state => state.shapes.shapes.entities)
    const dispatch = useAppDispatch()

    const fontFamilies = [
        "Inter, sans-serif",
        "Arial, sans-serif",
        "Helvetica, sans-serif",
        "Georgia, serif",
        "Times New Roman, serif" ,
        "Courier New, monospace",
        "Monaco, monospace",
        "system-ui, sans-serif"
    ]

    const selectedTextShape = Object.keys(selectedShapes).map(id => shapesEntities[id]).find(shape => shape?.type === "text" ) as TextShape | undefined

    const updateTextProperty = (property : keyof TextShape , value : any) => {
        if(!selectedTextShape) return
        dispatch(updateShape({
            id : selectedTextShape.id,
            patch : {
                [property]  : value
            }
        }))
    }

    // if(!isOpen || !selectedTextShape) return null

    return (
        <div className={cn("fixed right-5 top-1/2 transform -translate-y-1/2 w-80 backdrop-blur-xl bg-white/8 border-white/12 gap-2 p-3 saturate-150 border rounded-lg z-50 transition-transform duration-300" , true ? "translate-x-0" : "translate-x-full")}>
            <div className="p-4 flex flex-col gap-10 overflow-y-auto max-h-[calc(100vh - 8rem)]">
                <div className='space-y-2'>
                    <Label className='text-white/80' > Font Family </Label>
                    <Select value={selectedTextShape?.fontFamily} onValueChange={(value) => updateTextProperty("fontFamily" , value)}>
                        <SelectTrigger className='bg-white/5 border-white/10 w-full text-white'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-black/90 border-white/10'>
                            {fontFamilies.map(font => (
                                <SelectItem key={font} value={font} className="text-white hover:bg-white/10">
                                    <span style={{fontFamily :font }}> {font.split(",")[0]} </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2' >
                    <Label > Font Size : {selectedTextShape?.fontSize}px </Label>
                    <Slider value={[selectedTextShape?.fontSize]} onValueChange={([value]) => updateTextProperty("fontSize" , value)} min={8} max={128} step={1} className="w-full" />
                </div>
                <div className='space-y-2' >
                    <Label > Font Weight : {selectedTextShape?.fontWeight}px </Label>
                    <Slider value={[selectedTextShape?.fontWeight]} onValueChange={([value]) => updateTextProperty("fontWeight" , value)} min={100} max={900} step={100} className="w-full" />
                </div>
            </div>
        </div>
        // shhould look 6:37:52
    )
}

export default TextSidebar