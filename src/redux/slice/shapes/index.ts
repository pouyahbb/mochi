import {createSlice , createEntityAdapter , nanoid , PayloadAction , EntityState} from '@reduxjs/toolkit'
import type {Point} from '../viewport'

export type Tool = 'select' | "frame" | 'rect' | "ellipse" | "freedraw" | "arrow" | "line" | "text" | "eraser"

export interface BaseShape {
    id : string
    stroke : string
    strokeWidth : number
    fill?:string | null
}

export interface FrameShape extends BaseShape {
    type : "frame"
    x : number
    y : number
    w  : number
    h : number
    frameNumber : number
}

export interface RectShape extends BaseShape{
    type : "rect"
    x : number
    y : number
    w  : number
    h : number
}


export interface EllipseShape extends BaseShape{
    type : "ellipse"
    x : number
    y : number
    w  : number
    h : number
}

export interface FreeDrawSahpe extends BaseShape {
    type : "freedraw"
    points : Point[]
}

export interface ArrowShape extends BaseShape{
    type : "arrow"
    startX : number
    startY : number
    endX : number
    endY : number
}

export interface LineShape extends BaseShape {
    type : "line"
    startX : number
    startY : number
    endX : number
    endY : number
}
export interface TextShape extends BaseShape {
    type : "text"
    x : number 
    y : number 
    text : string
    fontSize : number
    fontFamily : string
    fontWeight : number
    fontStyle : "normal" | "italic"
    textAlign : "right" | "left" | "center"
    textDecoration : "none" | "underline" | "line-through"
    lineHeight : number
    letterSpacing : number
    textTransform : "none" | "uppercase" | "lowercase" | "capitalize"
}

export interface GeneratedUIShape extends BaseShape {
    type : "generatedui",
    x:number
    y: number
    w : number
    h : number
    uiSpecData : string | null
    sourceFrameId : string
    isWorkflowPage?:boolean
}

export type Shape = FrameShape | RectShape | EllipseShape | FreeDrawSahpe | ArrowShape | LineShape | TextShape | GeneratedUIShape

const shapesAdapter = createEntityAdapter<Shape , string>({
    selectId : (s) => s.id
})

type SelectionMap = Record<string  , true>

interface HistoryState {
    past : EntityState<Shape, string>[]
    future : EntityState<Shape, string>[]
}

interface ShapesState {
    tool : Tool
    shapes : EntityState<Shape , string>
    selected : SelectionMap
    frameCounter : number
    history : HistoryState
}

const initialState: ShapesState  = {
    tool  : "select",
    shapes : shapesAdapter.getInitialState(),
    selected : {},
    frameCounter : 0,
    history : {
        past : [],
        future : []
    }
}

const DEFAULTS = {stroke : "#fff" , strokeWidth : 2 as const}

const makeFrame = (p : {
    x : number
    y : number
    w : number
    h : number
    frameNumber : number
    stroke?:string
    strokeWidth?:string
    fill?:string | null
}) : FrameShape => ({
    id : nanoid(),
    type :"frame",
    x : p.x,
    y : p.y,
    w : p.w,
    h:p.h,
    frameNumber : p.frameNumber,
    stroke : "transparent",
    strokeWidth : 0,
    fill : p.fill ?? "rgba(355 , 255 , 255 , 0.05)"
})

const makeRect = (p: { 
    x : number 
    y : number
    w : number
    h : number
    stroke?: string
    strokeWidth?: number
    fill?: string | null
}) : RectShape => ({
    id : nanoid(),
    type : "rect",
    h : p.h,
    x  : p.x,
    y : p.y,
    w :p.w,
    stroke : p.stroke || DEFAULTS.stroke,
    strokeWidth : p.strokeWidth || DEFAULTS.strokeWidth,
    fill : p.fill ?? null
})

const makeEllipse = (p : {
    x : number 
    y : number
    w : number
    h : number
    stroke?: string
    strokeWidth?: number
    fill?: string | null
}): EllipseShape => ({
    id : nanoid(),
    type : "ellipse",
    h : p.h,
    x  : p.x,
    y : p.y,
    w :p.w,
    stroke : p.stroke || DEFAULTS.stroke,
    strokeWidth : p.strokeWidth || DEFAULTS.strokeWidth,
    fill : p.fill ?? null  
})

const makeFree = (p : {
    points : Point[]
    stroke?: string
    strokeWidth?: number
    fill?: string | null
} ) : FreeDrawSahpe => ({
    id : nanoid(),
    type : "freedraw",
    points : p.points , 
    stroke : p.stroke ?? DEFAULTS.stroke,
    strokeWidth : p.strokeWidth ?? DEFAULTS.strokeWidth,
    fill : p.fill ?? null
})

const makeArrow = (p : {
    startX : number
    startY : number
    endX : number
    endY : number
    stroke ?:string
    strokeWidth?: number
    fill?:string | null
}) : ArrowShape => ({
    id : nanoid(),
    type : "arrow",
    endX : p.endX,
    endY : p.endY , 
    startX : p.startX , 
    startY : p.startY,
    stroke : p.stroke ?? DEFAULTS.stroke,
    strokeWidth : p.strokeWidth ?? DEFAULTS.strokeWidth,
    fill : p.fill ?? null
})

const makeLine = (p:{
    startX : number
    startY : number
    endX : number
    endY : number
    stroke ?:string
    strokeWidth?: number
    fill?:string | null  
}) : LineShape => ({
    id : nanoid(),
    type : "line",
    endX : p.endX,
    endY : p.endY , 
    startX : p.startX , 
    startY : p.startY,
    stroke : p.stroke ?? DEFAULTS.stroke,
    strokeWidth : p.strokeWidth ?? DEFAULTS.strokeWidth,
    fill : p.fill ?? null
})

const makeText = (p : {
    x : number 
    y : number 
    text?: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: number
    fontStyle?: "normal" | "italic"
    textAlign?: "right" | "left" | "center"
    textDecoration?: "none" | "underline" | "line-through"
    lineHeight?: number
    letterSpacing?: number
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize"
    stroke?: string
    strokeWidth?: number 
    fill?: string
}) : TextShape => ({
    id : nanoid(),
    type : "text",
    fontFamily : p.fontFamily ?? "Inter, sans-serif",
    x : p.x,
    y : p.y,
    text : p.text ?? "Type here...",
    fontSize : p.fontSize ?? 16,
    fontWeight : p.fontWeight ?? 400,
    fontStyle : p.fontStyle ?? "normal",
    textAlign : p.textAlign ?? "left",
    textDecoration : p.textDecoration ?? "none",
    lineHeight : p.lineHeight ?? 1.2,
    letterSpacing : p.letterSpacing ?? 0,
    textTransform : p.textTransform ?? "none",
    stroke : p.stroke ?? DEFAULTS.stroke,
    strokeWidth:p.strokeWidth ?? DEFAULTS.strokeWidth,
    fill : p.fill ?? "#fff"
})

const makeGeneratedUI = (p : {
    x:number
    y: number
    w : number
    h : number
    uiSpecData : string | null
    sourceFrameId : string
    id?: string
    stroke?: string
    strokeWidth?: number
    fill?: string
    isWorkflowPage?:boolean
}) : GeneratedUIShape => ({
    id : p.id ?? nanoid(),
    type : "generatedui",
    x : p.x,
    h : p.h,
    y : p.y,
    w : p.w,
    fill : p.fill ?? null,
    sourceFrameId : p.sourceFrameId,
    stroke : "transparent" ,
    strokeWidth : 0,
    uiSpecData : p.uiSpecData,
    isWorkflowPage : p.isWorkflowPage
})

// Helper function to save state to history
const saveToHistoryHelper = (state: ShapesState) => {
    const currentState = JSON.parse(JSON.stringify(state.shapes))
    state.history.past.push(currentState)
    // Limit history to last 50 states
    if(state.history.past.length > 50) {
        state.history.past.shift()
    }
    // Clear future when new action is performed
    state.history.future = []
}

const shapesSlice = createSlice({
    name : "shapes",
    initialState ,
    reducers : {
        setTool(state, action : PayloadAction<Tool> ) {
            state.tool = action.payload
            if(action.payload !== "select") state.selected = {}
        },
        undo(state) {
            if(state.history.past.length === 0) return
            const previousState = state.history.past.pop()!
            state.history.future.unshift(JSON.parse(JSON.stringify(state.shapes)))
            state.shapes = previousState
        },
        redo(state) {
            if(state.history.future.length === 0) return
            const nextState = state.history.future.shift()!
            state.history.past.push(JSON.parse(JSON.stringify(state.shapes)))
            state.shapes = nextState
        },
        addFrame(state , action:PayloadAction<Omit<Parameters<typeof makeFrame>[0], "frameNumber">>) {
            saveToHistoryHelper(state)
            state.frameCounter += 1
            const frameWithNumber  = {
                ...action.payload,
                frameNumber : state.frameCounter
            }
            shapesAdapter.addOne(state.shapes , makeFrame(frameWithNumber))
        },
        addRect(state , action : PayloadAction<Parameters<typeof makeRect>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeRect(action.payload))
        },
        addEllipse(state , action : PayloadAction<Parameters<typeof makeEllipse>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeEllipse(action.payload))
        },
        addFreeDrawShape(state , action : PayloadAction<Parameters<typeof makeFree>[0]>) {
            const {points} = action.payload
            if(!points || points.length === 0) return 
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeFree(action.payload))
        },
        addArrow(state , action:PayloadAction<Parameters<typeof makeArrow>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeArrow(action.payload))
        },
        addLine(state , action:PayloadAction<Parameters<typeof makeLine>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeLine(action.payload))
        },
        addText(state , action:PayloadAction<Parameters<typeof makeText>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeText(action.payload))
        },
        addGeneratedUI(state , action:PayloadAction<Parameters<typeof makeGeneratedUI>[0]>) {
            saveToHistoryHelper(state)
            shapesAdapter.addOne(state.shapes , makeGeneratedUI(action.payload))
        },
        updateShape(state , action:PayloadAction<{id : string; patch : Partial<Shape>}>) {
            const {id , patch} = action.payload
            const shape = state.shapes.entities[id]
            if(!shape) return
            // Only save to history if this is a meaningful change (not just height updates)
            const isSignificantChange = 'x' in patch || 'y' in patch || 'w' in patch || 'text' in patch || 'points' in patch || 'startX' in patch || 'startY' in patch || 'endX' in patch || 'endY' in patch
            if(isSignificantChange) {
                saveToHistoryHelper(state)
            }
            shapesAdapter.updateOne(state.shapes , {id , changes  : patch})
        },
        removeShape(state , action : PayloadAction<string>) {
            saveToHistoryHelper(state)
            const id = action.payload
            const shape = state.shapes.entities[id]
            if(shape?.type === "frame"){
                state.frameCounter = Math.max(0 , state.frameCounter - 1 )
            }
            shapesAdapter.removeOne(state.shapes , id)
            delete state.selected[id]
        },
        clearAll (state) {
            saveToHistoryHelper(state)
            shapesAdapter.removeAll(state.shapes)
            state.selected = {}
            state.frameCounter = 0
        },
        selectShape(state , action : PayloadAction<string>) {
            state.selected[action.payload] = true
        },
        deleteShape(state , action : PayloadAction<string>){
            delete state.selected[action.payload]
        },
        clearSelection(state){
            state.selected = {}
        },
        selectAll(state){
            const ids = state.shapes.ids as string[]
            state.selected = Object.fromEntries(ids.map((id) => [id , true]))
        },
        deleteSelected(state) {
            const ids = state.shapes.ids as string[]
            if(ids.length) {
                saveToHistoryHelper(state)
                shapesAdapter.removeMany(state.shapes , ids)
            }
            state.selected = {}
        },
        loadProject (state , action : PayloadAction<{
            shapes : EntityState<Shape, string> 
            tool : Tool
            selected : SelectionMap,
            frameCounter: number
        }>) {
            state.shapes = action.payload.shapes,
            state.tool = action.payload.tool,
            state.selected = action.payload.selected,
            state.frameCounter = action.payload.frameCounter
            // Clear history when loading a new project
            state.history = { past: [], future: [] }
        }
    }
})

export const {
    setTool,
    addFrame,
    addArrow,
    addEllipse,
    addFreeDrawShape,
    addGeneratedUI,
    addLine,
    addRect,
    addText,
    clearAll,
    clearSelection,
    deleteSelected,
    deleteShape,
    loadProject,
    removeShape,
    selectAll,
    selectShape,
    updateShape,
    undo,
    redo
} = shapesSlice.actions

export default shapesSlice.reducer