import React from 'react'

import { IoSettingsOutline, IoClose } from 'react-icons/io5'
import { BsFillChatFill, BsFillSignpostFill, BsTelegram } from 'react-icons/bs'
import { BiColorFill, BiError, BiHelpCircle, BiLogIn, BiSend, BiTrash } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'
import { GiFireworkRocket } from 'react-icons/gi'

const Icons = {
    'settings': IoSettingsOutline,
    'chat': BsFillChatFill,
    'send': BiSend,
    'close': IoClose,
    'users': FaUsers,
    'sign': BsFillSignpostFill,
    'trash': BiTrash,
    'color-picker': BiColorFill,
    'firework': GiFireworkRocket,
    'telegram': BsTelegram,
    'login': BiLogIn,
    'help': BiHelpCircle,
    'error': BiError,
}

export type IconName = keyof typeof Icons

type Props = {
    icon: IconName
    size?: number
    color?: string
}

export const Icon = ({ icon, size, color }: Props) => {
    const Component = Icons[icon]
    return <Component size={size} color={color} />
}