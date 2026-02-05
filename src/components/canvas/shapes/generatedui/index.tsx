import React from 'react'
import { GeneratedUIShape } from '@/redux/slice/shapes'
import { useUpdatContainer } from '@/hooks/use-styles'
import LiquidButton from '@/components/buttons/liquid-button'
import { Download, MessageCircle, Workflow } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
    shape: GeneratedUIShape
    toggleChat: (generatedUIId: string) => void
    generateWorkflow: (generatedUIId: string) => void
    exportDesign: (generatedUIId: string, element: HTMLElement | null) => void
}

const GeneratedUI = ({shape, toggleChat, generateWorkflow, exportDesign}: Props) => {
    const {containerRef, sanitizeHtml} = useUpdatContainer(shape)

    const handleGenerateWorkflow = () => {
        generateWorkflow(shape.id)
    }
    const handleExportDesign = () => {
        if(!shape.uiSpecData){
            console.log("No UI data to export ")
            toast.error("No UI data to export")
            return
        }
        exportDesign(shape.id , containerRef.current) 
    }

    const handleToggleChat = () => {
        toggleChat(shape.id)
    }
    return (
    <div 
        ref={containerRef} 
        className="absolute pointer-events-none" 
        style={{
            left : shape.x, 
            top : shape.y, 
            width : shape.w, 
            height : "auto"
        }}
    >
        <div 
            className="w-full h-auto relative rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm"
            style={{
                boxShadow : "0 8px 32px rgba(0,0,0,0.3)",
                padding : "16px",
                height : "auto",
                minHeight : "120px",
                position : "relative"
            }}       
        >
            <div 
                className="h-auto w-full"
                style={{
                    pointerEvents : "none",
                    height : "auto",
                    maxWidth:"100%",
                    boxSizing : "border-box",
                }}
            >
                <div className="absolute -top-8 right-0 flex gap-2">
                    <LiquidButton 
                        size="sm"
                        variant='subtle'
                        onClick={handleExportDesign}
                        disabled={!shape.uiSpecData}
                        style={{pointerEvents : "auto"}}
                    >
                        <Download size={12} />
                        Export
                    </LiquidButton>
                    <LiquidButton 
                        size="sm"
                        variant='subtle'
                        onClick={handleGenerateWorkflow}
                        style={{pointerEvents : "auto"}}
                    >
                        <Workflow size={12} />
                        Generate Workflow
                    </LiquidButton>
                    <LiquidButton 
                        size="sm"
                        variant='subtle'
                        onClick={handleToggleChat}
                        style={{pointerEvents : "auto"}}
                    >
                        <MessageCircle size={12} />
                        Design Chat
                    </LiquidButton>
                </div>
                {shape.uiSpecData ? (
                    <div className="h-auto" dangerouslySetInnerHTML={{__html : sanitizeHtml(shape.uiSpecData)}} />
                ) : (
                    <div className="flex items-center justify-center p-8 text-white/60">
                        <div className="animate-pulse"> Generating design... </div>
                    </div>
                )}
            </div>
        </div>
        <div className="absolute -top-6 left-0 text-xs px-2 py-1 rounded whitespace-nowrap text-white/60 bg-black/40" style={{fontSize :"10px"}}>
            Generate UI
        </div>
    </div>
  )
}

export default GeneratedUI