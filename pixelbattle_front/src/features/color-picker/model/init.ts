import { sample } from 'effector'

import { socket } from '@/shared/api/socket'
import { $userData, logout } from '@/features/auth/model'
import { toggleList } from '@/features/player-list/model'
import { toggleChat } from '@/features/chat/model'

import { sendNewColorWithId } from './private'
import { sendNewColor, $windowVisible, onNewColor, toggleWindow } from './public'

$windowVisible
    .on(toggleWindow, (a) => !a)
    .reset([logout, toggleList, toggleChat])

sample({
    clock: sendNewColor,
    source: $userData,
    filter: (user) => user.id !== 0,
    fn: (user, color) => ({ userId: user.id, color }),
    target: sendNewColorWithId
})

sendNewColorWithId.watch((newColor) => {
    socket.emit('setColor', newColor)
})

socket.on('newColor', (data) => onNewColor(data))
