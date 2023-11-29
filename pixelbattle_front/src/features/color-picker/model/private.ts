import { createDomain } from 'effector'

const d = createDomain()

export const $windowVisible = d.store(false)
