"use client"
import { addArrow, addEllipse, addFrame, addFreeDrawShape, addGeneratedUI, addLine, addRect, addText, clearSelection, FrameShape, removeShape, selectShape, setTool, Shape, Tool, updateShape, undo, redo } from "@/redux/slice/shapes"
import { handToolDisable, handToolEnable, panEnd, panMove, panStart, Point, screenToWorld, wheelPan, wheelZoom } from "@/redux/slice/viewport"
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import React, { useEffect, useRef, useState } from "react"
import { downloadBlob, exportGeneratedUIAsPNG, generateFrameSnapshot } from "@/lib/frame-snapshot"
import { nanoid } from "@reduxjs/toolkit"
import { toast } from "sonner"
import { useGenerateWorkflowMutation } from "@/redux/api/generation"
import { addErrorMessage, addUserMessage, clearChat, finishStreamingResponse, initializeChat, startStreamingResponse, updateStreamingContent } from "@/redux/slice/chat"

interface TouchPointer  {
    id : number
    p : Point
}
interface DraftShape { 
    type : "frame" | "rect" | "ellipse" | "arrow" | "line"
    startWorld : Point
    currentWorld : Point 
}

const RAF_INTERVAL_MS=8

export const useInfiniteCanvas = () => {
    const dispatch = useDispatch<AppDispatch>()
    const viewport = useAppSelector(s => s.viewport)
    const entityState = useAppSelector(s => s.shapes.shapes)
    const shapeList:Shape[] = entityState.ids.map((id : string) => entityState.entities[id]).filter((s:Shape | undefined) : s is Shape => Boolean(s))
    
    const currentTool = useAppSelector(s => s.shapes.tool)
    const selectedShapes = useAppSelector(s => s.shapes.selected)
    const [ isSidebarOpen  , setIsSidebarOpen] = useState(false)
    const shapeEntities = useAppSelector(state => state.shapes.shapes.entities)

    const hasSelectedText = Object.keys(selectedShapes).some((id) => {
        const shape = shapeEntities[id]
        return shape?.type === "text"
    })

    useEffect(() => {
        if(hasSelectedText && !isSidebarOpen){
            setIsSidebarOpen(true)
        }else if(!hasSelectedText){
            setIsSidebarOpen(false)
        }
    } , [hasSelectedText, isSidebarOpen ])
    const canvasRef = useRef<HTMLDivElement | null>(null)
    const touchMapRef = useRef<Map<number , TouchPointer>>(new Map())
    const draftShapRef = useRef<DraftShape | null >(null)
    const freeDrawPointsRef = useRef<Point[]>([])
    const isSpacePressed = useRef(false)
    const isDrawingRef = useRef(false)
    const isMovingRef = useRef(false)
    const moveStartRef = useRef<Point | null>(null)

    const initialShapesPositionsRef = useRef<
        Record<
            string,
            {
                x?: number
                y?:number
                points?:Point[]
                startX?: number
                startY?:number
                endX?:number
                endY?:number 
            }
        >
    >({})
    const isErasingRef =useRef(false)
    const erasedShapesRef = useRef<Set<string>>(new Set())
    const isResizingRef = useRef(false)
    const resizeDataRef = useRef<{
        shapeId : string
        corner : string
        initialBounds : {x : number , y : number , w : number , h : number}
        startPoint : {x : number , y : number}
    } | null> (null)
    const lastFreeHandFrameRef= useRef(0)
    const freehandRafRef = useRef<number | null>(null)
    const panRafRef = useRef<number | null>(null)
    const pendingPanPointRef = useRef<Point | null>(null)
    const [, force] = useState(0)
    const requestRender = () : void => {
        force((n) => (n + 1) | 0)
    }
    
    const localPointFromClient = (clientX : number , clientY : number) : Point => {
        const el = canvasRef.current
        if(!el) return {x : clientX , y : clientY}
        const r = el.getBoundingClientRect()
        return {x : clientX - r.left , y : clientY - r.top}
    }
    const blurActiveTextInput = () => {
        const activeElement = document.activeElement
        if(activeElement && activeElement.tagName === "INPUT"){
            ;(activeElement as HTMLInputElement).blur
        }
    }
    type WithClientXY = {clientX : number; clientY : number}
    const getLocalPointFromPtr = (e:WithClientXY) : Point => localPointFromClient(e.clientX , e.clientY)

    const getShapeAtPoint = (worldPoint : Point) : Shape | null => {
        for(let i =shapeList.length - 1; i>=0; i--){
            const shape = shapeList[i]
            if(isPointInShape(worldPoint, shape)){
                return shape
            }
        }
        return null
    }

    const isPointInShape = (point : Point , shape : Shape):boolean  => {
        switch(shape.type){
            case "frame":
            case "rect":
            case "ellipse":
            case "generatedui":
                return (
                    point.x >= shape.x && 
                    point.x <= shape.x + shape.w && 
                    point.y >= shape.y && 
                    point.y <= shape.y + shape.h
                )
            case "freedraw":
                const threshold = 5
                for(let i =0; i < shape.points.length - 1 ; i++){
                    const p1 = shape.points[i]
                    const p2 = shape.points[i + 1]
                    if(distanceToLineSegment(point, p1 , p2 ) <= threshold){
                        return true
                    }
                }
                return false
            case "arrow":
            case "line":
                const lineThreshold = 8 
                return (
                    distanceToLineSegment(point , {x : shape.startX , y : shape.startY} , {x : shape.endX , y : shape.endY}) <= lineThreshold
                )
            case "text":
                const textWidth = Math.max(shape.text.length * (shape.fontSize * 0.6) , 100)
                const textHeight = shape.fontSize * 1.2
                const padding = 8
                return (
                    point.x >= shape.x - 2 && 
                    point.x <= shape.x + textWidth + padding + 2 && 
                    point.y >= shape.y - 2 && 
                    point.y <= shape.y + textHeight + padding + 2
                )
            default : 
                return false

        }
    }
    const distanceToLineSegment = (point : Point , lineStart : Point , lineEnd: Point):number => {
        const A = point.x - lineStart.x
        const B = point.y - lineStart.y
        const C = lineEnd.x - lineStart.x
        const D = lineEnd.y - lineStart.y
        
        const dot = A * C + B * D
        const lenSg = C * C + D * D

        let param = -1
        if(lenSg !== 0) param = dot /lenSg

        let xx , yy
        if(param < 0){
            xx = lineStart.x
            yy = lineStart.y
        }else if(param > 1 ){
            xx = lineEnd.x
            yy = lineEnd.y
        }else{
            xx = lineStart.x + param * C
            yy = lineStart.y + param * D
        }
        const dx = point.x - xx
        const dy = point.y - yy
        return Math.sqrt(dx * dx + dy * dy)
    }
    const schedulePanMove = (p : Point) => {
        pendingPanPointRef.current = p
        if(panRafRef.current !== null) return
        panRafRef.current = window.requestAnimationFrame(() => {
            panRafRef.current = null
            const next = pendingPanPointRef.current
            if(next) dispatch(panMove(next))
        })
    }
    const freehandTick = () : void => {
        const now = performance.now()
        if(now - lastFreeHandFrameRef.current >= RAF_INTERVAL_MS){
            if(freeDrawPointsRef.current.length > 0) requestRender()
                lastFreeHandFrameRef.current = now
        }
        if(isDrawingRef.current){
            freehandRafRef.current = window.requestAnimationFrame(freehandTick)
        }
    }
    const onWheel = (e:WheelEvent) => {
        e.preventDefault()
        const originScreen = localPointFromClient(e.clientX , e.clientY)
        if(e.ctrlKey || e.metaKey){
            dispatch(wheelZoom({deltaY: e.deltaY , originScreen}))
        }else{
            const dx = e.shiftKey ? e.deltaY : e.deltaX
            const dy = e.shiftKey ? 0 : e.deltaY
            dispatch(wheelPan({dx : -dx , dy : -dy}))
        }
    }
    const onPointerDown : React.PointerEventHandler<HTMLDivElement> =  (e) => {
        const target = e.target as HTMLElement
        const isButton = target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.classList.contains("pointer-events-auto") || 
        target.closest(".pointer-events-auto")
        if(!isButton){
            e.preventDefault()
        }else{
            console.log("Not preventing default - clicked on interactive element: " , target)
            return 
        }
        const local = getLocalPointFromPtr(e.nativeEvent)
        const world  = screenToWorld(local , viewport.translate , viewport.scale)

        if (touchMapRef.current.size <= 1) {
            canvasRef.current?.setPointerCapture(e.pointerId)
            const isPanButton = e.button === 1 || e.button === 2
            const panByShift = isSpacePressed.current && e.button === 0

            if(isPanButton || panByShift){
                const mode = isSpacePressed.current ? "shiftPanning" : "panning"
                dispatch(panStart({screen : local , mode}))
                return 
            }
            if(e.button === 0){
                if(currentTool === "select"){
                    const hitShape = getShapeAtPoint(world)
                    if(hitShape){
                        const isAlreadySelected = selectedShapes[hitShape.id]
                        if(!isAlreadySelected){
                            if(!e.shiftKey) dispatch(clearSelection())
                            dispatch(selectShape(hitShape.id))
                        }
                        isMovingRef.current = true
                        moveStartRef.current = world

                        initialShapesPositionsRef.current = {}

                        Object.keys(selectedShapes).forEach(id => {
                            const shape = entityState.entities[id]
                            if(shape){
                                if(shape.type === "frame"|| shape.type === "rect" || shape.type === "ellipse" || shape.type === "generatedui"){
                                    initialShapesPositionsRef.current[id] = {
                                        x : shape.x,
                                        y : shape.y
                                    }
                                }else if(shape.type === "freedraw"){
                                    initialShapesPositionsRef.current[id]= {
                                        points : [...shape.points]
                                    }
                                }else if(shape.type === "arrow" || shape.type === "line"){
                                    initialShapesPositionsRef.current[id]={
                                        startX : shape.startX,
                                        startY : shape.startY,
                                        endX : shape.endX,
                                        endY : shape.endY
                                    }
                                }else if(shape.type === "text"){
                                    initialShapesPositionsRef.current[id] = {
                                        x : shape.x , 
                                        y : shape.y 
                                    }
                                }
                            }
                        })
                        if(hitShape.type === "frame" || hitShape.type === "rect" || hitShape.type === "ellipse" || hitShape.type === "generatedui"){
                            initialShapesPositionsRef.current[hitShape.id]= {
                                x : hitShape.x,
                                y : hitShape.y
                            }
                        }else if(hitShape.type === "freedraw"){
                            initialShapesPositionsRef.current[hitShape.id] = {
                                points : [...hitShape.points]
                            }
                        }else if(hitShape.type === "arrow" || hitShape.type === "line"){
                            initialShapesPositionsRef.current[hitShape.id] = {
                                startX : hitShape.startX,
                                startY : hitShape.startY,
                                endX : hitShape.endX,
                                endY : hitShape.endY
                            }
                        }else if(hitShape.type === "text"){
                            initialShapesPositionsRef.current[hitShape.id] = {
                                x : hitShape.x,
                                y : hitShape.y
                            }
                        }
                    }else {
                        if(!e.shiftKey){
                            dispatch(clearSelection())
                            blurActiveTextInput()
                        }
                    }
                }else if(currentTool==="eraser"){
                    isErasingRef.current = true
                    erasedShapesRef.current.clear()
                    const hitShape = getShapeAtPoint(world)
                    if(hitShape){
                        dispatch(removeShape(hitShape.id))
                        erasedShapesRef.current.add(hitShape.id)
                    }else{
                        blurActiveTextInput()
                    }
                }else if(currentTool === "text"){
                    dispatch(addText({x : world.x , y : world.y}))
                    dispatch(setTool("select"))
                }else{
                    isDrawingRef.current = true
                    if(currentTool === "frame" || currentTool === "rect" || currentTool === "ellipse" || currentTool === "arrow" || currentTool === "line"){
                        console.log("Startinh to draw : " , currentTool , " at " , world)
                        draftShapRef.current = {
                            type : currentTool,
                            startWorld : world,
                            currentWorld : world
                        }
                        requestRender()
                    }else if(currentTool === "freedraw"){
                        freeDrawPointsRef.current = [world]
                        lastFreeHandFrameRef.current = performance.now()
                        freehandRafRef.current = window.requestAnimationFrame(freehandTick)
                        requestRender()
                    }
                }
            }
        }
    }
    const onPointerMove : React.PointerEventHandler<HTMLDivElement> = (e) => {
        const local = getLocalPointFromPtr(e.nativeEvent)
        const world = screenToWorld(local , viewport.translate , viewport.scale)

        if(viewport.mode === "panning" || viewport.mode === "shiftPanning"){
            schedulePanMove(local)
            return 
        }
        if(erasedShapesRef.current && currentTool === "eraser"){
            const hitShape = getShapeAtPoint(world)
            if(hitShape && !erasedShapesRef.current.has(hitShape.id)){
                dispatch(removeShape(hitShape.id))
                erasedShapesRef.current.add(hitShape.id)
            }
        }
        if(isMovingRef.current && moveStartRef.current && currentTool === "select"){
            const deltaX = world.x - moveStartRef.current.x
            const deltaY = world.y - moveStartRef.current.y
            Object.keys(initialShapesPositionsRef.current).forEach(id => {
                const initialPos = initialShapesPositionsRef.current[id]
                const shape = entityState.entities[id]
                if(shape && initialPos){
                    if(shape.type === "frame" || 
                        shape.type === "rect" || 
                        shape.type === "ellipse" || 
                        shape.type === "text" || 
                        shape.type === "generatedui"
                    ){
                        if(typeof initialPos.x === "number" && typeof initialPos.y === "number"){
                            dispatch(updateShape({
                                id , 
                                patch : {
                                    x : initialPos.x + deltaX,
                                    y : initialPos.y + deltaY
                                }
                            }))
                        }
                    }else if(shape.type === "freedraw"){
                        const initialPoints = initialPos.points
                        if(initialPoints){
                            const newPoints = initialPoints.map(point => ({
                                x : point.x + deltaX,
                                y : point.y + deltaY
                            }))
                            dispatch(updateShape({
                                id,
                                patch : {
                                    points : newPoints   
                                }
                            }))
                        }
                    }else if(shape.type === "arrow" || shape.type === "line"){
                        if(typeof initialPos.startX === "number" && typeof initialPos.startY === "number" && typeof initialPos.endX === "number" && typeof initialPos.endY === "number"){
                            dispatch(updateShape({
                                id , 
                                patch : {
                                    startX : initialPos.startX + deltaX, 
                                    startY : initialPos.startY + deltaY,
                                    endX : initialPos.endX + deltaX,
                                    endY : initialPos.endY + deltaY
                                }
                            }))
                        }
                    }
                }
            })
        }
        if(isDrawingRef.current){
            if(draftShapRef.current){
                draftShapRef.current.currentWorld = world
                requestRender()
            }else if(currentTool === "freedraw"){
                freeDrawPointsRef.current.push(world)
            }
        }
    }
    const finalizeDrawingIfAny = () : void => {
        if(!isDrawingRef.current) return
        isDrawingRef.current = false

        if(freehandRafRef.current){
            window.cancelAnimationFrame(freehandRafRef.current)
            freehandRafRef.current = null
        }
        const draft = draftShapRef.current

        if(draft){
            const x = Math.min(draft.startWorld.x , draft.currentWorld.x)
            const y = Math.min(draft.startWorld.y , draft.currentWorld.y)
            const w = Math.abs(draft.currentWorld.x -  draft.startWorld.x)
            const h = Math.abs(draft.currentWorld.y -  draft.startWorld.y)
            if(w > 1 && h  > 1 ){
                if(draft.type === "frame"){
                    console.log("Adding frame shape" , {x , y , w , h})
                    dispatch(addFrame({x , y , w , h}))
                }else if(draft.type === "rect"){
                    console.log("Adding rect shape" , {x , y , w , h})
                    dispatch(addRect({x , y , w , h}))
                } else if(draft.type === "ellipse"){
                    console.log("Adding ellipse shape" , {x , y , w , h})
                    dispatch(addEllipse({x , y , w , h}))
                } else if(draft.type === "arrow"){
                    console.log("Adding arrow shape" , {x , y , w , h})
                    dispatch(addArrow({
                        startX : draft.startWorld.x,
                        startY : draft.startWorld.y,
                        endX : draft.currentWorld.x,
                        endY : draft.currentWorld.y,
                    }))
                }else if(draft.type === "line"){
                    dispatch(addLine({
                        startX : draft.startWorld.x,
                        startY : draft.startWorld.y,
                        endX : draft.currentWorld.x,
                        endY : draft.currentWorld.y 
                    }))
                }
            }
            draftShapRef.current = null
        }else if(currentTool === "freedraw"){
            const pts = freeDrawPointsRef.current
            if(pts.length > 1 ) dispatch(addFreeDrawShape({points : pts}))
            freeDrawPointsRef.current = []
        }
        requestRender()
    }
    const onPointerUp : React.PointerEventHandler<HTMLDivElement> = (e) => {
        canvasRef.current?.releasePointerCapture?.(e.pointerId)
        if(viewport.mode === "panning" || viewport.mode === "shiftPanning"){
            dispatch(panEnd())
        }
        if(isMovingRef.current){
            isMovingRef.current = false
            moveStartRef.current = null
            initialShapesPositionsRef.current = {}
        }
        if(isErasingRef.current){
            isErasingRef.current = false
            erasedShapesRef.current.clear()
        }
        finalizeDrawingIfAny()
    }
    const onPointerCancel : React.PointerEventHandler<HTMLDivElement> = (e) => {
        onPointerUp(e)
    }
    const onKeyDown = (e : KeyboardEvent) : void => {
        // Undo/Redo shortcuts
        if((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault()
            dispatch(undo())
            return
        }
        if((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault()
            dispatch(redo())
            return
        }
        // Shift for panning
        if(e.code === "ShiftLeft" || e.code === "ShiftRight" && !e.repeat){
            e.preventDefault()
            isSpacePressed.current = true
            dispatch(handToolEnable())
        }
    }
    const onKeyUp = (e : KeyboardEvent) : void => {
        if(e.code === "ShiftLeft" || e.code === "ShiftRight"){
            e.preventDefault()
            isSpacePressed.current = false
            dispatch(handToolDisable())
        }
    }
    useEffect(() => {
        document.addEventListener("keydown" , onKeyDown)
        document.addEventListener("keyup" , onKeyUp)
        return () => {
            document.removeEventListener("keydown" , onKeyDown)
            document.removeEventListener("keyup" , onKeyUp)
            if(freehandRafRef.current){
                window.cancelAnimationFrame(freehandRafRef.current)
                if(panRafRef.current) window.cancelAnimationFrame(panRafRef.current)
            }
        }
    } , []) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        const handleResizeStart = (e:CustomEvent) => {
            const {shapeId , corner , bounds} = e.detail
            isResizingRef.current = true
            resizeDataRef.current = {
                shapeId , 
                corner ,
                initialBounds : bounds,
                startPoint : { x: e.detail.clientX || 0 , y : e.detail.clientY || 0}
            }
        }
        const handleResizeMove = (e:CustomEvent) => {
            if(!isResizingRef.current || !resizeDataRef.current) return
            const {shapeId , corner , initialBounds} = resizeDataRef.current
            const {clientX , clientY} = e.detail 
            const canvasEl = canvasRef.current
            if(!canvasEl) return

            const rect = canvasEl.getBoundingClientRect()
            const localX = clientX - rect.left
            const localY = clientY - rect.top
            const world = screenToWorld({x : localX , y : localY} , viewport.translate , viewport.scale)
            const newBounds = {...initialBounds}

            switch(corner){
                case "nw" : 
                    newBounds.w = Math.max(10 , initialBounds.w + (initialBounds.x - world.x))
                    newBounds.h = Math.max(10 , initialBounds.h + (initialBounds.y - world.y))
                    newBounds.x = world.x
                    newBounds.y = world.y
                    break;
                case "ne" :
                    newBounds.w = Math.max(10 , world.x - initialBounds.x)
                    newBounds.h = Math.max(10 , initialBounds.h + (initialBounds.y - world.y))
                    newBounds.y = world.y
                    break
                case "sw" : 
                    newBounds.w = Math.max(10 , initialBounds.w + (initialBounds.x - world.x))
                    newBounds.h = Math.max(10 , world.y - initialBounds.y)
                    newBounds.x = world.x
                    break

                case "se" : 
                    newBounds.w = Math.max(10 , world.x - initialBounds.x)
                    newBounds.h = Math.max(10 , world.y - initialBounds.y)
                    break
            }
            const shape = entityState.entities[shapeId]
            if(!shape) return
            if(shape.type === "frame" || shape.type === "rect" || shape.type === "ellipse" || shape.type === "generatedui"){
                dispatch(updateShape({
                    id : shapeId,
                    patch : {
                        x : newBounds.x,
                        y  : newBounds.y,
                        w : newBounds.w ,
                        h : newBounds.h
                    }
                }))
            }else if(shape.type === "freedraw"){
                const xs = shape.points.map((p:{x : number , y : number}) => p.x)
                const ys = shape.points.map((p:{x : number , y : number}) => p.y)
                const actualMinX = Math.min(...xs)
                const actualMaxX = Math.max(...xs)
                const actualMinY = Math.min(...ys)
                const actualMaxY = Math.max(...ys)
                const actualWidth = actualMaxX - actualMinX
                const actualHeight = actualMaxY - actualMinY

                const newActualX = newBounds.x + 5
                const newActualY = newBounds.y  + 5
                const newActualWidth =  Math.max(10 , newBounds.w - 10)
                const newActualHeight = Math.max(10 , newBounds.h - 10)

                const scaleX = actualWidth > 0 ? newActualWidth /actualWidth : 1
                const scaleY = actualHeight > 0 ? newActualHeight /actualHeight : 1

                const scaledPoints = shape.points.map((point : {x : number , y : number}) => ({
                    x : newActualX + (point.x - actualMinX) * scaleX,
                    y : newActualY + (point.y - actualMinY) * scaleY
                }))
                dispatch(updateShape({
                    id : shapeId,
                    patch: {
                        points : scaledPoints
                    }
                }))
            }else if(shape.type === "line" || shape.type === "arrow"){
                const actualMinX = Math.min(shape.startX , shape.endX)
                const actualMaxX = Math.max(shape.startX , shape.endX)
                const actualMinY = Math.min(shape.startY , shape.endY)
                const actualMaxY = Math.max(shape.startY , shape.endY)
                const actualWidth = actualMaxX - actualMinX
                const actualHeight = actualMaxY - actualMinY

                const newActualX = newBounds.x + 5
                const newActualY = newBounds.y + 5
                const newActualWidth = Math.max(10 , newBounds.w - 10)
                const newActualHeight = Math.max(10 , newBounds.h - 10)

                let newStartX , newStartY , newEndX , newEndY
                if(actualWidth === 0){
                    newStartX = newActualX + newActualWidth / 2
                    newEndX = newActualX + newActualWidth / 2
                    newStartY = shape.startY < shape.endY ? newActualY : newActualY + newActualHeight
                    newEndY = shape.startY < shape.endY ? newActualY + newActualHeight : newActualY
                }else if(actualHeight === 0){
                    newStartY = newActualY + newActualHeight / 2
                    newEndY = newActualY + newActualHeight / 2
                    newStartX = shape.startX < shape.endX ? newActualX : newActualX + newActualWidth
                    newEndX = shape.startX < shape.endX ? newActualX + newActualWidth : newActualX
                }else{
                    const scaleX = newActualWidth / actualWidth
                    const scaleY = newActualHeight / actualHeight

                    newStartX = newActualX + (shape.startX - actualMinX) * scaleX
                    newStartY = newActualY + (shape.startY - actualMinY) * scaleY
                    newEndX = newActualX + (shape.endX - actualMinX) * scaleX
                    newEndY = newActualY + (shape.endY - actualMinY) * scaleY
                }
                dispatch(updateShape({
                    id : shapeId,
                    patch : {
                        startX : newStartX,
                        startY : newStartY,
                        endX : newEndX,
                        endY : newEndY
                    }
                }))
            }
        }
        const handleResizeEnd = () => {
            isResizingRef.current = false
            resizeDataRef.current = null
        }
        window.addEventListener("shape-resize-start" , handleResizeStart as EventListener)
        window.addEventListener("shape-resize-move" , handleResizeMove as EventListener)
        window.addEventListener("shape-resize-end" , handleResizeEnd as EventListener)
        return () => {
            window.removeEventListener("shape-resize-start" , handleResizeStart as EventListener)
            window.removeEventListener("shape-resize-move" , handleResizeMove as EventListener)
            window.removeEventListener("shape-resize-end" , handleResizeEnd as EventListener)
        }

    } , [dispatch, entityState.entities, viewport.translate,viewport.scale])

    const attachCanvasRef = (ref : HTMLDivElement | null) : void => {
        if(canvasRef.current){
            canvasRef.current.removeEventListener("wheel" , onWheel)
        }
        canvasRef.current = ref
        if(ref) {
            ref.addEventListener("wheel" , onWheel , { passive : false })
        }
    }
    const selectTool = (tool : Tool) : void => {
        dispatch(setTool(tool))
    }
    const getDraftShape = () : DraftShape | null => draftShapRef.current
    const getFreeDrawPoints = () : ReadonlyArray<Point> => freeDrawPointsRef.current

    return {
        viewport,
        shapes : shapeList,
        currentTool,
        selectedShapes,
        onPointerCancel, 
        onPointerDown,
        onPointerMove ,
        onPointerUp , 
        attachCanvasRef,
        selectTool,
        getDraftShape,
        getFreeDrawPoints,
        isSidebarOpen,
        hasSelectedText,
        setIsSidebarOpen
    }
} 


export const useFrame = (shape : FrameShape) => {
    const dispatch = useAppDispatch() 
    const [isGenerating , setIsGenerating] = useState(false)

    const allShapes = useAppSelector(state => Object.values(state.shapes.shapes?.entities || {}).filter((shape): shape is Shape => shape !== undefined))

     const handleGenerateDesign = async () => {
        try{
            setIsGenerating(true)
            const snapshot = await generateFrameSnapshot(shape , allShapes)
            downloadBlob(snapshot , `frame-${shape.frameNumber}-snapshot.png`)
            const formData = new FormData()
            // Convert Blob to File with proper type
            const imageFile = new File([snapshot], `frame-${shape.frameNumber}-snapshot.png`, {
                type: "image/png",
                lastModified: Date.now()
            })
            formData.append("image" , imageFile)
            formData.append("frameNumber" , shape.frameNumber.toString())

            const urlParams = new URLSearchParams(window.location.search)
            const projectId = urlParams.get("project")
            if(projectId){
                formData.append("projectId" , projectId)         
            }
            const response = await fetch("/api/generate" , {
                method : "POST",
                body : formData
            })
            if(!response.ok){
                const errorText = await response.text()
                console.error("Failed to generate design" , errorText)
                throw new Error(`API request failed : ${response.status} ${response.statusText} - ${errorText}`)
            }
            const generatedUIPosition = {
                x : shape.x + shape.w + 50,
                y : shape.y,
                w : Math.max(520 , shape.w),
                h : Math.max(420 , shape.h)
            }
            const generatedUIID = nanoid()
            dispatch(addGeneratedUI({
                ...generatedUIPosition,
                id : generatedUIID,
                uiSpecData : null,
                sourceFrameId : shape.id
            }))
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulatedData = ""

            let lastUpdateTime = 0
            const UPDATE_THROTTLE_MS = 500

            if(reader) {
                try{
                    while(true){
                        const {done , value} = await reader.read()
                        if(done){
                            dispatch(updateShape({
                                id : generatedUIID,
                                patch : {
                                    uiSpecData : accumulatedData
                                }
                            }))
                            break
                        }
                        const chunk = decoder.decode(value)
                        accumulatedData += chunk
                        const now = Date.now()
                        if(now - lastUpdateTime >= UPDATE_THROTTLE_MS){
                            dispatch(updateShape({
                                id : generatedUIID,
                                patch : {
                                    uiSpecData : accumulatedData
                                }
                            }))
                            lastUpdateTime = now
                        }
                    }
                }finally{
                    reader.releaseLock()
                }
            }
            
        }catch(err){
            console.error("Failed to generate design" , err)
            toast.error(`Failed to generate UI design : ${err instanceof Error ? err.message : "Unknown error"}`)
        }finally{
            setIsGenerating(false)
        }
     }
     return {isGenerating , handleGenerateDesign}
}


export const useInspiration = () => {
    const [isInspirationOpen , setIsInspirationOpen] = useState(false)
    const toggleInspiration = () => {
        setIsInspirationOpen(!isInspirationOpen)
    }
    const openInspiration = () => {
        setIsInspirationOpen(true)
    }
    const closeInspiration = () => {
        setIsInspirationOpen(false)
    }
    return {isInspirationOpen , toggleInspiration , closeInspiration , openInspiration}
}


export const useWorkflowGeneration = () => {
    const dispatch = useAppDispatch()
    const [, {isLoading : isGeneratingWorkflow}] = useGenerateWorkflowMutation() 
    const allShapes = useAppSelector((state) => Object.values(state.shapes?.shapes?.entities || {}).filter((shape) : shape is Shape => shape !== undefined))
    const generateWorkflow = async (generatedUIId : string) => {
        try{
            const currentShape = allShapes.find(shape => shape.id === generatedUIId)
            if(!currentShape || currentShape.type !== "generatedui"){
                toast.error("Generated UI not found")
                return
            }
            if(!currentShape.uiSpecData){
                toast.error("No design data to generate workflow from")
                return
            }
            const urlParams = new URLSearchParams(window.location.search)
            const projectId = urlParams.get("project")
            if(!projectId){
                toast.error("Project ID not found")
                return
            }
            const pageCount = 4 
            toast.loading('Generating workflow pages...' , {
                id : "workflow-generation"
            })
            const baseX = currentShape.x + currentShape.w + 100
            const spacing = Math.max(currentShape.w + 50 , 450)

            const workflowPromises = Array.from({length : pageCount}).map( async (_ , index) => {
                try{
                    const response = await fetch("/api/generate/workflow" , {
                        method : "POST",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify({
                            generatedUIId , 
                            currentHTML : currentShape.uiSpecData,
                            projectId,
                            pageIndex : index
                        })
                        
                    })
                    if(!response.ok){
                        throw new Error(`Failed to generate page ${index + 1}: ${response.status}`)
                    }
                    const workflowPosition = {
                        x : baseX + index * spacing,
                        y : currentShape.y,
                        w : Math.max(520 , currentShape.w),
                        h : Math.max(420 , currentShape.h)
                    }
                    const workflowId = nanoid()
                    dispatch(
                        addGeneratedUI({
                            ...workflowPosition,
                            id : workflowId,
                            uiSpecData : null,
                            sourceFrameId : currentShape.sourceFrameId,
                            isWorkflowPage : true
                        })
                    )
                    const reader = response?.body?.getReader()
                    const decoder = new TextDecoder()
                    let accumulatedData = ""
                    if(reader){
                        while(true){
                            const {done, value} = await reader.read()
                            if(done) break
                            const chunk = decoder.decode(value)
                            accumulatedData += chunk
                            dispatch(updateShape({
                                id : workflowId,
                                patch : {uiSpecData : accumulatedData}
                            }))
                        }
                    }
                    return {pageIndex : index , success : true}
                }catch(err){
                    console.error(`Error generating page ${index + 1}:` , err)
                    return {pageIndex : index , success : false , error : err}
                }
            })
            const result = await Promise.all(workflowPromises)
            const successCount = result.filter(r => r.success).length
            const failureCount = result.length - successCount
            if(successCount === 4){
                toast.success("All 4 workflow pages generated successfully!" , {
                    id : "workflow-generation"
                })
            }else if(successCount > 0){
                toast.success(`Geneated ${successCount}/4 workflow pages successfully`, {
                    id : "workflow-generation"
                })
                if(failureCount > 0){
                    toast.error(`Failed to generate ${failureCount} workflow pages`)
                }
            }else{
                toast.error(`Failed to generate workflow pages` , {
                    id : "workflow-generation"
                })
            }
            
        }catch(err){
            console.error(err)
            toast.error("Failed to generate workflow pages" , {
                id : "workflow-generation"
            })
        }
    }
    return {
        generateWorkflow,
        isGeneratingWorkflow
    }
}

export const useGlobalChat = () => {
    const [isChatOpen , setIsChatOpen] = useState(false)
    const [activeGeneratedUIId , setActiveGeneratedUIId] = useState<string | null>(null)
    const {generateWorkflow} = useWorkflowGeneration()

    const exportDesign = async(generatedUIId : string,element : HTMLElement | null) => {
        if(!element){
            console.error("No element to export for shape" , generatedUIId)
            toast.error("No design element found for export")
            return
        }
        try{
            const filename = `generated-ui-${generatedUIId.slice(0 , 8)}.png`
            await exportGeneratedUIAsPNG(element , filename)
            toast.success("Design exported successfully.")

        }catch(err){
            console.error("Failed to export GeneratedUI : " , err)
            toast.error("Failed to export design. Please try again.")
        }
    }
    const openChat = (generatedUIId : string) => {
        setIsChatOpen(true)
        setActiveGeneratedUIId(generatedUIId)
    }

    const closeChat = () => {
        setIsChatOpen(false)
        setActiveGeneratedUIId(null)
    }

    const toggleChat = (generatedUIId :string) => {
        if(isChatOpen && activeGeneratedUIId === generatedUIId){
            closeChat()
        }else{
            openChat(generatedUIId)
        }
    }

    return {
        isChatOpen,
        activeGeneratedUIId,
        generateWorkflow,
        openChat,
        closeChat,
        toggleChat,
        exportDesign
    }
}

export const useChatWindow = (generatedUIId : string, isOpen : boolean) => {
    const [inputValue , setInputValue] = useState("")
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const chatState = useAppSelector(state => state.chat?.chats?.[generatedUIId])
    const currentShape = useAppSelector(state => state.shapes.shapes.entities[generatedUIId])
    const allShapes = useAppSelector(state => state.shapes.shapes.entities)
    const getSourceFrame= () : FrameShape | null => {
        if(!currentShape || currentShape.type !== "generatedui"){
            return null
        }
        const sourceFrameId = currentShape.sourceFrameId
        if(!sourceFrameId){
            return null
        }
        const sourceFrame = allShapes[sourceFrameId]
        if(!sourceFrame || sourceFrame.type !== "frame"){
            return null
        }
        return sourceFrame as FrameShape
    } 
    useEffect(() => {
        if(isOpen){
            dispatch(initializeChat(generatedUIId))
        }
    } , [dispatch , generatedUIId , isOpen])

    useEffect(() => {
        if(scrollAreaRef.current){
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    } , [chatState?.messages])
    useEffect(() =>{
        if(isOpen && inputRef.current){
            setTimeout(() => inputRef.current?.focus() , 100)
        }
    } , [isOpen])
    const handleSendMessage = async () => {
        if(!inputValue.trim() || chatState?.isStreaming) return
        const message = inputValue.trim()
        setInputValue("")
        try{
            dispatch(addUserMessage({generatedUIId , content : message}))
            const responseId = `response-${Date.now()}`
            dispatch(startStreamingResponse({generatedUIId , messageId : responseId}))
            const isWorkflowPage = currentShape?.type === "generatedui" && currentShape.isWorkflowPage
            const urlParams = new URLSearchParams(window.location.search)
            const projectId = urlParams.get("project")
            if(!projectId) {
                throw new Error("Project ID not found in URL")
            }
            const baseRequestData = {
                userMessage : message,
                generatedUIId : generatedUIId,
                currentHTML : currentShape?.type === "generatedui" ? currentShape.uiSpecData : null,
                projectId : projectId
            }
            let apiEndpoint = "/api/generate/redesign"
            let wireframeSnapshot: string | null = null
            if(isWorkflowPage){
                apiEndpoint = '/api/generate/workflow-redesign'
            }else{
                const sourceFrame = getSourceFrame()
                if(sourceFrame && sourceFrame.type === "frame"){
                    try{
                        const allShapesArray = Object.values(allShapes).filter(Boolean) as Shape[]
                        const snapshot = await generateFrameSnapshot(sourceFrame, allShapesArray)
                        const arrayBuffer = await snapshot.arrayBuffer()
                        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
                        wireframeSnapshot = base64
                        
                    }catch(err){
                        console.warn("Failed to capture wireframe snapshot" , err)
                    }
                }
            }
            const requestData = isWorkflowPage ? baseRequestData : {...baseRequestData , wireframeSnapshot}
            const response = await fetch(apiEndpoint, {
                method : "POST",
                headers : { "Content-Type" : "application/json"},
                body : JSON.stringify(requestData)
            })
            if(!response.ok){
                throw new Error(`API request failed : ${response.status}` )
            }
            const reader =response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulatedData = ""
            if(reader){
                while(true){
                    const {done, value} = await reader.read()
                    if(done) break
                    const chunk = decoder.decode(value)
                    accumulatedData += chunk
                    dispatch(updateStreamingContent({generatedUIId ,messageId : responseId , content : "Rendering your design..."}))
                    dispatch(updateShape({
                        id : generatedUIId,
                        patch : {uiSpecData : accumulatedData}
                    }))
                }
            }
            dispatch(finishStreamingResponse({generatedUIId , messageId : responseId , finalContent : "Design regenerated successfully..."}))

        }catch(err){
            console.error("Failed to generate design" , err)
            dispatch(addErrorMessage({generatedUIId , error  : err instanceof Error ? err.message : "Failed to generate design. Please try again."}))
            toast.error("Failed to generate design.")
        }
    }
    const handleKeyPress = (e:React.KeyboardEvent) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault()
            handleSendMessage()
        }
    }
    const handleClearChat = () => {
        dispatch(clearChat(generatedUIId))
    }
    return {
        inputValue,
        setInputValue,
        scrollAreaRef,
        inputRef,
        handleSendMessage,
        handleKeyPress,
        handleClearChat,
        chatState
    }
}