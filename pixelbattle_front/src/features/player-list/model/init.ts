import { sample } from 'effector'
import { onNewColor } from '@/features/color-picker/model'
import { toggleChat } from '../../chat/model'
import { $userData, logout } from '../../login/model'
import {
    joinOnline,
    onDisconnectPlayer,
    onPlayersList,
    toggleList,
    $playerListVisible,
    $players
} from './public'
import { socket } from '@/lib/socket'

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

logout.watch(() => {
    socket.disconnect()
})

socket.on('currentPlayers', (list) => onPlayersList(list))
socket.on('playerDisconnected', (data) => onDisconnectPlayer(data.socketId))
