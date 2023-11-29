import { createDomain } from 'effector'

const d = createDomain()
export const $timeRemaining = d.store(0)
export const $drawingBlocked = d.store(false)