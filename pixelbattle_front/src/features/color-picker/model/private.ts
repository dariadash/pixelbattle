import { createDomain } from 'effector'

const d = createDomain()

export const sendNewColorWithId = d.event<{ userId: number, color: string }>()