import React from 'react'
import { useUnit } from 'effector-react'
import styled, { css } from 'styled-components'

import {
    $pixels,
    drawPixel,
    getStartCanvas,
    initPixels,
    startCountdown
} from '../model/private'
import { $drawingBlocked } from '../model'

const TIMEOUT_IN_TICKS = 10
const GRID_SIZE = Number(process.env.GRID_SIZE) || 20
const CANVAS_SIZE = Number(process.env.CANVAS_SIZE) || 10000

if (CANVAS_SIZE % GRID_SIZE !== 0) {
    console.warn(`[board] CANVAS_SIZE (${CANVAS_SIZE}) is not divisible by GRID_SIZE (${GRID_SIZE}), pixel mapping may break`)
}

export const Board = () => {
    const [drawingBlocked] = useUnit([$drawingBlocked])
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)

    const prepareCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = CANVAS_SIZE
        canvas.height = CANVAS_SIZE
        canvas.style.width = `${CANVAS_SIZE}px`
        canvas.style.height = `${CANVAS_SIZE}px`

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            console.error('Canvas 2d context is not available')
            return
        }
        ctx.lineCap = 'square'
        ctxRef.current = ctx

        const rows = canvas.height / GRID_SIZE
        const cols = canvas.width / GRID_SIZE

        initPixels({ rows, cols })
    }

    React.useEffect(() => {
        const unwatch = $pixels.watch((actualPixels) => {
            const ctx = ctxRef.current
            if (!ctx) return
            for (let row = 0; row < actualPixels.length; row++) {
                for (let col = 0; col < actualPixels[row].length; col++) {
                    ctx.fillStyle = actualPixels[row][col]
                    ctx.strokeStyle = actualPixels[row][col]
                    ctx.fillRect(
                        row * GRID_SIZE,
                        col * GRID_SIZE,
                        GRID_SIZE,
                        GRID_SIZE
                    )
                }
            }
        })

        return () => {
            unwatch()
        }
    }, [ctxRef])

    const handleClick = React.useCallback((event) => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const row = Math.floor(x / GRID_SIZE)
        const col = Math.floor(y / GRID_SIZE)

        drawPixel({ col, row })
        startCountdown(TIMEOUT_IN_TICKS)
    }, [])

    React.useEffect(() => {
        prepareCanvas()
        getStartCanvas()
    }, [])

    return (
        <Canvas
            blockcanvas={drawingBlocked}
            ref={canvasRef}
            onClick={handleClick}
        />
    )
}

type StyledProps = {
    blockcanvas: boolean,
}

const Canvas = styled.canvas<StyledProps>`
    flex: 0 0 auto;
    width: ${CANVAS_SIZE}px;
    max-width: none;
    height: ${CANVAS_SIZE}px;
    max-height: none;
    image-rendering: pixelated;
    ${({ blockcanvas }) => blockcanvas && css`
        pointer-events: none;
    `}
`
