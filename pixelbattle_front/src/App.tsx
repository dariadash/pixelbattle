import React from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import 'react-toastify/dist/ReactToastify.css'

import { $isAuthorized, $userData, logout } from './features/login/model'
import { AuthPage } from './features/login/view'
import { Container } from './features/container/view'
import { Button, Icon } from './ui'
import { checkAuth } from './lib/axios'
import { ColorNamePicker } from './features/color-picker/view'
import { Chat } from './features/chat/view'
import { $unseenChatMessages, toggleChat } from './features/chat/model'
import { toggleList } from './features/player-list/model'
import { WhoIsOnline } from './features/player-list/view'

export function App() {
    const isAuthorized = useStore($isAuthorized)
    const userData = useStore($userData)
    const unseenChatMessages = useStore($unseenChatMessages)

    console.log(isAuthorized, '!!!!')
    console.log(userData, '!!!!2')

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            checkAuth()
        }
    }, [])

    if (!isAuthorized) {
        return (
            <AuthPage />
        )
    }

    return (
        <div>
            <Header>
                <Icon icon='firework' size={30} />
                <h3>
                    {userData.isActivated ? 'Акк подтвержден' : 'Подтвердите акк'}
                </h3>
                <ButtonsContainer>
                    <Button onClick={toggleChat}>
                        {unseenChatMessages > 0 && <UnseenBadge>{unseenChatMessages}</UnseenBadge>}
                        <Icon size={20} icon={'chat'} />
                    </Button>
                    <Button onClick={toggleList}>
                        <Icon size={20} icon={'users'} />
                    </Button>
                    <Button blockBtn onClick={() => logout()}>
                        Выйти
                    </Button>
                </ButtonsContainer>
            </Header>
            <Chat />
            <WhoIsOnline />
            <ColorNamePicker />
            <Container />
        </div>
    )
}

const Header = styled.header`
    padding: 10px 0;
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    background-color: #e660a7;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    gap: 12px;
`