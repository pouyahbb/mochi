import {  fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"

export interface ColorSwatch {
    name : string
    hexColor : string
    description?:string 
}

export interface ColorSection {
    title : "Primary Colours" | "Secondary & Accent Colors" | "UI Component Colours" | "Utility & Form Colors" | "Status & Feedback Colors"
    swatches : ColorSwatch[]
}

export interface TypographyStyle{
    name : string
    fontFamily : string
    fontSize : string
    fontWeight : string
    lineHeight : string
    letterSpacing?:string
    description?: string
}

export interface TypographySection {
    title : string
    styles: TypographyStyle[]
}

export interface StyleGuide {
    theme : string
    description : string
    colorSections : [
        ColorSection,
        ColorSection,
        ColorSection,
        ColorSection,
        ColorSection,
    ]
    typographySections: [TypographySection,TypographySection , TypographySection]
}

export interface GenerateStyleGuideResponse {
    success : boolean
    message : string
    styleGuide : StyleGuide
}

export interface GenerateStyleGuideRequest {
    projectId : string
}
export const styleGuideApi = createApi({
    reducerPath : "styleGuideApi",
    baseQuery : fetchBaseQuery({baseUrl : "/api/generate"}),
    tagTypes : ["StyleGuide"],
    endpoints : (builder) => ({
        generateStyleGuide : builder.mutation<GenerateStyleGuideResponse , GenerateStyleGuideRequest>({
            query : ({projectId}) => ({
                url : "/style",
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : {projectId}
            }),
            invalidatesTags : ["StyleGuide"]
        })
    })

})

export const {useGenerateStyleGuideMutation} = styleGuideApi