import { forward, guard, sample } from 'effector'
import { throttle } from 'patronum'
import { socket } from '@/lib/socket'
import {
    getStartCanvas,
    getStartCanvasFx,
    $pixels,
    initPixels,
    drawPixelWithColor,
    foreignDrawPixel,
    $working,
    abortCountdown,
    startCountdown,
    tick,
    abortTimer,
    timerFx,
} from './private'
import { setPixelReducer, setPixelsReducer } from './reducers'
import { Axios } from '@/lib/axios'
import { logout } from '@/features/login/model'
import { $drawingBlocked, $timeRemaining } from './public'
import { openToast } from '@/features/toasts/model/public'

const TIMEOUT_IN_MS = 10000

initPixels.watch(console.log)

$pixels
    .on(initPixels, (_, { cols, rows }) => {
        return Array(Math.round(rows)).fill(
            Array(Math.round(cols)).fill('#ffffff')
        )
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


$drawingBlocked.watch((payload) => {
    console.info('block status', payload)
})

socket.on('canvas-data', ({ row, col, color }) => {
    foreignDrawPixel({ row, col, color })
})

drawPixelWithColor.watch(({ row, col, color }) => {
    socket.emit('canvas-data', { row, col, color })
})

sample({
    clock: getStartCanvas,
    target: getStartCanvasFx
})

getStartCanvasFx.use(() => Axios.get('/')
    .then(response => response.data)
    .catch(error => {
        openToast({ message: error.response.data.message, options: { type: 'error' } })
        logout()
    })
)

function createCountdown({ start, abort = abortTimer, timeout = 1000 }) {
    // tick every 1 second
    timerFx.use(() => wait(timeout))
    $working.on(abort, () => false).on(start, () => true)

    guard({
        source: start,
        filter: timerFx.pending.map(is => !is),
        target: tick,
    })

    forward({
        from: tick,
        to: timerFx,
    })

    const willTick = guard({
        source: timerFx.done.map(({ params }) => params - 1),
        filter: seconds => seconds >= 0,
    })

    guard({
        source: willTick,
        filter: $working,
        target: tick,
    })

    return { tick }
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export const countdown = createCountdown({
    start: startCountdown,
    abort: abortCountdown,
})

$timeRemaining
    .on(countdown.tick, (_, s) => s)
