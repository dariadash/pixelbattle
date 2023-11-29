import { createDomain } from 'effector'

const d = createDomain()

export const $color = d.store<string>('#000000')
export const setColor = d.event<string>()