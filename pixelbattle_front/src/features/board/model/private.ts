import { createDomain, sample } from 'effector'
import { pending } from 'patronum/pending'
import { $color } from '@/features/container/model'

const d = createDomain()

export const getStartCanvas = d.event()
export const getStartCanvasFx = d.effect<any, any, Error>()
export const $processingStartCanvas = pending({ effects: [getStartCanvasFx] })

export const $pixels = d.store<string[][]>([])
export const initPixels = d.event<{ rows: number, cols: number }>()
export const drawPixel = d.event<{ row: number, col: number }>()

export const drawPixelWithColor = sample({
    clock: drawPixel,
    source: $color,
    fn: (color, { row, col }) => ({
        color, row, col
    })
})

export const foreignDrawPixel = d.event<{ row: number, col: number, color: string }>()

export const $working = d.store(true)
export const tick = d.event()
export const abortTimer = d.event()
export const timerFx = d.effect<any, any, Error>()

export const startCountdown = d.event<number>()
export const abortCountdown = d.event()
