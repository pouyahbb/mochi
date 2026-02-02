import { FrameShape } from '@/redux/slice/shapes'
import {LiquidButton}  from '@/components/buttons/liquid-button'
import { Brush , Palette } from 'lucide-react';
import {useFrame} from '@/hooks/use-canvas'


/**
 * Frame component - renders a container frame with background and optional border
 * Frames are typically used as containers for grouping other elements
 */
export const Frame = ({ 
    shape, 
    toggleInspiration 
}: { 
    shape: FrameShape
    toggleInspiration?: () => void 
}) => {
    const {isGenerating , handleGenerateDesign} = useFrame(shape)
    return(
        <>
            <div 
                style={{left : shape.x , top : shape.y , width : shape.w , height : shape.h , borderRadius:"12px"}}
                className="absolute pointer-events-none backdrop-blur-xl bg-white/8 border border-white/12 saturation-150"
            />
            <div
                style={{left : shape.x , top : shape.y - 24 , fontSize : "11px" , lineHeight : "1.2"}} 
                className="absolute pointer-events-none whitespace-nowrap text-xs font-medium text-white/80 select-none"
            >
                Frame {shape.frameNumber}
            </div>
            <div 
                style={{left : shape.x + shape.w - 235 , top : shape.y - 36 , zIndex : 1000}}
                className="absolute pointer-events-auto flex gap-4"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <LiquidButton size="sm" variant='subtle' onClick={toggleInspiration} style={{pointerEvents : "auto"}}>
                    <Palette size={12} />
                    Inpiration
                </LiquidButton>
                <LiquidButton size="sm" variant='subtle' onClick={handleGenerateDesign} disabled={isGenerating} className={isGenerating ? "animate-pulse" : ""} style={{pointerEvents : "auto"}}>
                    <Brush className={isGenerating ? "animate-spin" : ""} size={12} />
                    {isGenerating ? "Generating..." : "Generate Design"}
                </LiquidButton>
                
            </div>


        </>
    )
};
