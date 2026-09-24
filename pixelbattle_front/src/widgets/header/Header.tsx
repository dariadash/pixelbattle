import React from 'react'
import styled from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { themeVar } from 'igoresha-dev-ui-kit'

import { Button, Icon, ButtonsWrapper } from '@/shared/ui'
import { $unseenChatMessages, toggleChat } from '@/features/chat/model'
import { toggleList } from '@/features/player-list/model'
import { logout } from '@/features/auth/model'

export function Header() {
    const { t } = useTranslation()
    const unseenChatMessages = useUnit($unseenChatMessages)

    return (
        <HeaderBar>
            <Icon icon='firework' size={30} />
            <ButtonsWrapper>
                <Button onClick={toggleChat}>
                    {unseenChatMessages > 0 && <UnseenBadge>{unseenChatMessages}</UnseenBadge>}
                    <Icon size={20} icon={'chat'} />
                </Button>
                <Button onClick={toggleList}>
                    <Icon size={20} icon={'users'} />
                </Button>
                <Button blockBtn onClick={() => logout()}>
                    {t('common.logout')}
                </Button>
            </ButtonsWrapper>
        </HeaderBar>
    )
}

const HeaderBar = styled.header`
    padding: 10px 5%;
    width: 100%;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${themeVar('overlayBackdrop')};
    border-bottom: 1px solid ${themeVar('borderSubtle')};
    color: ${themeVar('textPrimary')};
`

const UnseenBadge = styled.div`
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 16px;
    font-size: 12px;
    border-radius: 16px;
    border-width: 2px;
    margin-left: 30px;
    margin-top: -20px;
    position: absolute;
    background-color: ${themeVar('actionDanger')};
    color: ${themeVar('actionDangerText')};
`
