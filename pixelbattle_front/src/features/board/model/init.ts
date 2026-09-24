import { sample } from 'effector'
import { throttle } from 'patronum'

import { socket } from '@/shared/api/socket'
import { Axios } from '@/shared/api/axios'
import { translateServerMessage } from '@/shared/lib/i18n'
import { logout } from '@/features/auth/model'
import { openToast } from '@/features/toasts/model'
import {
    getStartCanvas,
    getStartCanvasFx,
    initPixels,
    drawPixelWithColor,
    foreignDrawPixel,
    $working,
    abortCountdown,
    startCountdown,
    tick,
    timerFx,
} from './private'
import { $pixels, $drawingBlocked, $timeRemaining } from './public'
import { setPixelReducer, setPixelsReducer } from './reducers'
import { DRAW_COOLDOWN_TICKS } from './const'

const TIMEOUT_IN_MS = 10000

$pixels
    .on(initPixels, (_, { cols, rows }) => {
        return Array.from({ length: Math.round(rows) }, () => Array(Math.round(cols)).fill('#ffffff'))
    })
    .on([drawPixelWithColor, foreignDrawPixel], setPixelReducer)
    .on(getStartCanvasFx.doneData, setPixelsReducer)


const throttledDrawPixel = throttle({
    source: drawPixelWithColor,
    timeout: TIMEOUT_IN_MS,
})

$drawingBlocked
    .on(drawPixelWithColor, () => true)
    .on(throttledDrawPixel, () => false)


socket.on('canvas-data', ({ row, col, color }) => {
    foreignDrawPixel({ row, col, color })
})

drawPixelWithColor.watch(({ row, col, color }) => {
    socket.emit('canvas-data', { row, col, color })
})

sample({
    clock: drawPixelWithColor,
    fn: () => DRAW_COOLDOWN_TICKS,
    target: startCountdown,
})

sample({
    clock: getStartCanvas,
    target: getStartCanvasFx
})

getStartCanvasFx.use(() => Axios.get('/')
    .then(response => response.data)
    .catch(error => {
        const [message] = translateServerMessage(error.response?.data?.message)
        openToast({ message, options: { type: 'error' } })
        logout()
        return []
    })
)

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

timerFx.use(() => wait(1000))

$working
    .on(startCountdown, () => true)
    .on(abortCountdown, () => false)

$timeRemaining
    .on(startCountdown, (_, seconds) => seconds)
    .on(timerFx.done, (seconds) => Math.max(0, seconds - 1))

sample({
    clock: startCountdown,
    target: tick,
})

sample({
    clock: tick,
    filter: timerFx.pending.map((pending) => !pending),
    target: timerFx,
})

sample({
    clock: timerFx.done,
    source: { seconds: $timeRemaining, working: $working },
    filter: ({ seconds, working }) => working && seconds > 0,
    target: tick,
})

export const countdown = { tick }
