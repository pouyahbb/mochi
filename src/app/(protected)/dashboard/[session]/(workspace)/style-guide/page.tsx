import MoodBoard from '@/components/style/mood-board'
import { ThemeContent } from '@/components/style/theme'
import StyleGuideTypography from '@/components/style/typography'
import { TabsContent } from '@/components/ui/tabs'
import { MoodBoardImagesQuery, StyleGuideQuery } from '@/convex/query.config'
import { MoodBoardImage } from '@/hooks/use-styles'
import { StyleGuide } from '@/redux/api/style-guide'
import { Palette } from 'lucide-react'
import React from 'react'

type Props = {
    searchParams: Promise<{
        project : string
    }>
}

const Page = async ({searchParams} : Props) => {
    const projectId = (await searchParams).project
    const existingStyleGuide = await StyleGuideQuery(projectId)

    // Parse the style guide string if it exists
    const styleGuideString = existingStyleGuide.styleGuide?._valueJSON as string | null | undefined
    let guide: StyleGuide | null = null
    
    if (styleGuideString) {
        try {
            guide = typeof styleGuideString === 'string' 
                ? JSON.parse(styleGuideString) 
                : styleGuideString as StyleGuide
        } catch (error) {
            console.error('Failed to parse style guide:', error)
            guide = null
        }
    }

    const colorGuide = guide?.colorSections || []
    const typographyGuide = guide?.typographySections || []
    const existingMoodBoardImages = await MoodBoardImagesQuery(projectId)
    const guideImages = existingMoodBoardImages.images._valueJSON as unknown as MoodBoardImage[]


    return (
        <div>
            <TabsContent value="colours" className='space-y-8'>
                {!colorGuide || colorGuide.length === 0 ? (
                    <div className='space-y-8'>
                        <div className='text-center py-20'>
                            <div className='w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center'>
                                <Palette className='w-8 h-8 text-muted-foreground' />
                            </div>
                            <h3 className='text-lg font-medium text-foreground mb-2'> No colors generated yet </h3>
                            <p className='text-sm text-muted-foreground max-w-md mx-auto mb-6' >
                                Upload images to your mood board and generate an AI-powerd style guide with colors and typography.
                            </p>
                        </div>
                    </div>
                ) : (
                  <ThemeContent  colorGuide={colorGuide} />
                )}
            </TabsContent>
            <TabsContent className='space-y-8' value="typography">
                <StyleGuideTypography typographyGuide={typographyGuide} />
            </TabsContent>
            <TabsContent className='space-y-8' value="moodboard">
                <MoodBoard guideImages={guideImages} />
            </TabsContent>
        </div>
    )
}

export default Page