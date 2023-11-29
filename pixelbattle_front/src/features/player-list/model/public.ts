import { createDomain } from 'effector'
import { OnlinePlayerItem } from './types'

const d = createDomain()

export const $playerListVisible = d.store(false)
export const $players = d.store<OnlinePlayerItem[]>([])


export const onNewPlayer = d.event<OnlinePlayerItem>()
export const onDisconnectPlayer = d.event<string>()

export const toggleList = d.event()