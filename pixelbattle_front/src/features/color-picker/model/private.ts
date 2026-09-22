import { createDomain } from 'effector'

const d = createDomain()

export const $windowVisible = d.store(false)

export const sendNewColor = d.event<string>()
export const sendNewColorWithId = d.event<{ userId: number, color: string }>()