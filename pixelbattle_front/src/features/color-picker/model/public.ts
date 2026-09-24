import { createDomain } from 'effector'
import { OnNewColorPayload } from './types'

const d = createDomain()

export const $windowVisible = d.store(false)

export const sendNewColor = d.event<string>()
export const toggleWindow = d.event()
export const onNewColor = d.event<OnNewColorPayload>()