import { createDomain } from 'effector'
import { OnNewColorPayload } from './types'

const d = createDomain()

export const closeWindow = d.event()

export const toggleWindow = d.event()
export const sendNewColor = d.event<string>()
export const onNewColor = d.event<OnNewColorPayload>()