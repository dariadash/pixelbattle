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
    const resultPixels: string[][] = []
    for (const pixel of pixels) {
        if (typeof resultPixels[pixel.row] === 'undefined') {
            resultPixels[pixel.row] = []
        }
        resultPixels[pixel.row][pixel.col] = pixel.color
    }
    return resultPixels
}