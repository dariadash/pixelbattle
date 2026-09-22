import { createDomain } from 'effector'
import { OnNewColorPayload } from './types'

const d = createDomain()

export const toggleWindow = d.event()

export const onNewColor = d.event<OnNewColorPayload>()