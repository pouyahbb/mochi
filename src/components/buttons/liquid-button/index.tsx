import { cn } from '@/lib/utils'
import React from 'react'

interface LiquidButtonProps {
    children : React.ReactNode
    onClick?: (e?:React.MouseEvent<HTMLButtonElement>) => void
    className?:string
    size?:"sm" | "md" | "lg"
    variant?:"default" | "subtle"
    disabled?:boolean
    style?:React.CSSProperties
}


const LiquidButton:React.FC<LiquidButtonProps> = ({
    children , 
    className ,
    onClick,
    size="md",
    style,
    variant="default",
    disabled=false
}) => {
    const sizeClasses = {
        sm : "px-2 py-1 text-xs rounded-lg",
        md : "px-3 py-2 text-sm rounded-xl",
        lg : "px-4 py-3 text-base rounded-2xl"
    }
    const variantClasses = {
        default : "backdrop-blur-xl bg-white/[0.8] border border-white/12 saturate-150",
        subtle : "backdrop-blur-lg bg-white/[0.05] border border-white/8 saturate-125"
    }

  return (
    <button 
        className={cn(
            "relative transition-all duration-200 ease-out whitespace-nowrap " ,
            "text-white/90 font-medium",
            "flex items-center gap-2",
            "pointer-events-auto cursor-pointer",
            sizeClasses[size],
            variantClasses[variant],
            "hover:bg-white/12 hover:border-white/16",
            "active:bg-white/6 active:scale-[0.98]",
            "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent",
            disabled && "opacity-50 cursor-no-allowed hover:bg-white/8 hover:border-white/12 active:scale-100",
            className
        )} 
        onClick={onClick} 
        disabled={disabled} 
        style={style}
    >
        {children}
    </button>
  )
}

export default LiquidButton
