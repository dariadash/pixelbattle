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
            <Logo title='PixelBattle' />
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

const Logo = styled.span`
    width: 40px;
    height: 40px;
    display: inline-block;
    flex: 0 0 auto;
    background-color: ${themeVar('textPrimary')};
    mask: url('painting.svg') no-repeat center / contain;
    -webkit-mask: url('painting.svg') no-repeat center / contain;
    cursor: pointer;
    transition: transform 0.2s ease;
    animation: gradient 5s ease infinite;

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    &:hover {
        background: linear-gradient(-45deg, 
            ${themeVar('actionDisabled')},
            ${themeVar('actionSecondary')}, 
            ${themeVar('actionPrimary')}, 
            ${themeVar('actionDanger')}
        );
        background-size: 400% 400%;
        transform: scale(1.25);
    }
`

const UnseenBadge = styled.div`    
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    border-radius: 16px;
    padding: 2px;
    margin-left: 30px;
    margin-top: -30px;
    position: absolute;
    background-color: ${themeVar('actionDanger')};
    color: ${themeVar('actionDangerText')};
`
