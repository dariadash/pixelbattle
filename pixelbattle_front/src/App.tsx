import React from 'react'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { themeVar } from 'igoresha-dev-ui-kit'
import 'react-toastify/dist/ReactToastify.css'

import { Button, Icon, ButtonsWrapper, Loader } from './ui'

import { $authChecked, $isAuthorized, initApp, logout, $loading } from './features/login/model'
import { AuthPage } from './features/login/view'
import { Container } from './features/container/view'
import { ColorNamePicker } from './features/color-picker/view'
import { $unseenChatMessages, toggleChat } from './features/chat/model'
import { Chat } from './features/chat/view'
import { toggleList } from './features/player-list/model'
import { WhoIsOnline } from './features/player-list/view'
import { ChatSettings } from './features/chat/view/ChatSettings'
import { LanguageSwitcher } from './features/language-switcher/view'

export function App() {
    const { t } = useTranslation()
    const [isAuthorized, authChecked, loading, unseenChatMessages] = useUnit([$isAuthorized, $authChecked, $loading, $unseenChatMessages])

    React.useEffect(() => {
        initApp()
    }, [])

    if (!authChecked || loading) return <Loader />
    if (!isAuthorized) return (<><AuthPage /><LanguageSwitcher /></>)

    return (
        <div>
            <Header>
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
            </Header>
            <Chat />
            <ChatSettings />
            <WhoIsOnline />
            <ColorNamePicker />
            <Container />
            <LanguageSwitcher />
        </div>
    )
}

const Header = styled.header`
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
