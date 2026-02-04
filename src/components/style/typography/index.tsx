import { Type } from 'lucide-react'
import React from 'react'

type Props =  {
    typographyGuide : any
}

const StyleGuideTypography = ({typographyGuide}  : Props) => {

    return <>
        {!typographyGuide || typographyGuide.length === 0 ? (
            <div className='text-center py-20'>
                <Type className='w-16 h-16 mx-auto mb-4 text-muted-foreground' />
                <h3 className='text-lg font-medium text-foreground mb-2'>
                    No typography generated yet
                </h3>
                <p className='text-sm text-muted-foreground mb-6'>
                    Generate a style guide to see typography recommendations.
                </p>

            </div>
        ) : (
            <div className='flex flex-col gap-8'>
                {typographyGuide.map((section: any , index : number) => (
                    <div key={index} className='flex flex-col gap-4'>
                        <div>
                            <h3 className='text-base font-semibold text-foreground/70'> 
                                {section.title}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.styles?.map((style:any , styleIndex : number) => (
                                <div key={styleIndex} className='p-4 rounded-xl backdrop-blur-xl bg-white/2 border border-white/8 saturate-150 hover:bg-white/5 transition-colors'>
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"> 
                                                {style.name}
                                            </h4>
                                        </div>
                                        {style.description && 
                                            <p className='text-xs text-muted-foreground leading-relaxed'>
                                                {style.description}
                                            </p>
                                        }
                                    </div>
                                    <div className='mt-3 mb-3 py-2 border-t border-white/8'>
                                        <div className='text-foreground wrap-break-word' style={{
                                            fontFamily : style.fontFamily,
                                            fontSize : style.fontSize,
                                            fontWeight : style.fontWeight,
                                            lineHeight : style.lineHeight,
                                            letterSpacing : style.letterSpacing || "normal"
                                        }}>
                                            The quick brown fox jumps over the lazy dog
                                        </div>
                                    </div>
                                    <div className='pt-2 border-t border-white/8'>
                                        <div className='grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground font-mono'>
                                            <div className='truncate'>
                                                <span className='text-foreground/50'>Font:</span> {style.fontFamily}
                                            </div>
                                            <div className='truncate'>
                                                <span className='text-foreground/50'>Size:</span> {style.fontSize}
                                            </div>
                                            <div className='truncate'>
                                                <span className='text-foreground/50'>Weight:</span> {style.fontWeight}
                                            </div>
                                            <div className='truncate'>
                                                <span className='text-foreground/50'>Line:</span> {style.lineHeight}
                                            </div>
                                            {style.letterSpacing && (
                                                <div className='truncate col-span-2'>
                                                    <span className='text-foreground/50'>Spacing:</span> {style.letterSpacing}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>   
        )}
    </>
}

export default StyleGuideTypography