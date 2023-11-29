import { onNewColor } from '@/features/color-picker/model'
import { openChat, toggleChat } from '../../chat/model'
import { logout } from '../../login/model'
import {
    onDisconnectPlayer,
    onNewPlayer,
    toggleList,
    $playerListVisible,
    $players
} from './public'

$playerListVisible
    .on(toggleList, (s) => !s)
    .reset([
        toggleChat,
        logout,
        openChat
    ])

$players
    .on(onNewPlayer, (s, a) => [...s, a])
    .on(onDisconnectPlayer, (s, f) => s.filter(({ name }) => name !== f))
    .on(onNewColor, (s, a) => s.map((item) => {
        if (item.socketId === a.socketId) {
            return {
                ...item,
                color: a.color
            }
        }
        return { ...item }
    }))
