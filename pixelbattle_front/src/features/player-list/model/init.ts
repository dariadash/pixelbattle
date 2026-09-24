import { sample } from 'effector'

import { socket } from '@/shared/api/socket'
import { onNewColor } from '@/features/color-picker/model'
import { toggleChat } from '@/features/chat/model'
import { $userData, logout } from '@/features/auth/model'

import {
    joinOnline,
    onDisconnectPlayer,
    onPlayersList,
    toggleList,
    $playerListVisible,
    $players,
    getCurrentPlayers
} from './public'

$playerListVisible
    .on(toggleList, (s) => !s)
    .reset([toggleChat, logout])

$players
    .on(onPlayersList, (_, list) => list)
    .on(onDisconnectPlayer, (s, socketId) => s.filter((item) => item.socketId !== socketId))
    .on(onNewColor, (s, a) => s.map((item) => {
        if (item.socketId === a.socketId) {
            return {
                ...item,
                color: a.color
            }
        }
        return { ...item }
    }))
    .reset(logout)

sample({
    clock: $userData,
    filter: (user) => user.id !== 0,
    fn: (user) => user.id,
    target: joinOnline,
})

joinOnline.watch((userId) => {
    if (!socket.connected) {
        socket.connect()
    }
    socket.emit('joinOnline', { userId })
})

getCurrentPlayers.watch(() => socket.emit('currentPlayers'))

logout.watch(() => socket.disconnect())

socket.on('currentPlayers', (list) => onPlayersList(list))
socket.on('playerDisconnected', (data) => onDisconnectPlayer(data.socketId))
