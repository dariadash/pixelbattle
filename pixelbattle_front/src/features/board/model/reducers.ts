import { CANVAS_SIZE, GRID_SIZE } from '@/shared/lib/board-constants'

const FALLBACK_COLOR = '#ffffff'

export const ROWS = Math.round(CANVAS_SIZE / GRID_SIZE)
export const COLS = Math.round(CANVAS_SIZE / GRID_SIZE)

export const setPixelReducer = (r: string[][], { row, col, color }: {
    row: number, col: number, color: string
}) => {
    return r.map((d, rowIndex) => d.map(
        (cellColor, colIndex) =>
            rowIndex === row && colIndex === col
                ? color
                : cellColor
    ))
}

export const setPixelsReducer = (_, pixels: {
    row: number, col: number, color: string
}[]) => {
    const resultPixels: string[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(FALLBACK_COLOR))
    for (const pixel of pixels ?? []) {
        if (pixel.row >= 0 && pixel.row < ROWS && pixel.col >= 0 && pixel.col < COLS) {
            resultPixels[pixel.row][pixel.col] = pixel.color
        }
    }
    return resultPixels
}
