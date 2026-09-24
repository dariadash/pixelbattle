export const GRID_SIZE = Number(process.env.GRID_SIZE) || 20
export const CANVAS_SIZE = Number(process.env.CANVAS_SIZE) || 10000

if (CANVAS_SIZE % GRID_SIZE !== 0) {
    console.warn(`[board] CANVAS_SIZE (${CANVAS_SIZE}) is not divisible by GRID_SIZE (${GRID_SIZE}), pixel mapping may break`)
}
