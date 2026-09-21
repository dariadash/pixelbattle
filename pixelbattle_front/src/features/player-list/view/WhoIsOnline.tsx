import React from 'react'
import { useUnit } from 'effector-react'
import styled from 'styled-components'
import { themeVar } from 'igoresha-dev-ui-kit'
import { Button, ButtonsWrapper, Icon } from '@/ui'
import { $playerListVisible, $players, toggleList } from '../model'
import { UserItem } from './UserItem'

export const WhoIsOnline = () => {
    const [playerListVisible, players] = useUnit([$playerListVisible, $players])
    if (!playerListVisible) {
        return null
    }
    return (
        <Container>
            <ButtonsWrapper>
                <h2>Список игроков</h2>
                <Button onClick={toggleList} size='small'>
                    <Icon icon="close" />
                </Button>
            </ButtonsWrapper>
            <ItemsContainer>
                {players.map((item) => (
                    <UserItem
                        color={item.color}
                        key={item.socketId}
                        socketId={item.socketId}
                        name={item.name}
                    />
                ))}
            </ItemsContainer>
        </Container>
    )
}

const ItemsContainer = styled.div`
    overflow-y: auto;
    flex: 1;
    flex-direction: column;
    display: flex;
    gap: 12px;
`

const Container = styled.div`
    width: 360px;
    max-width: 100%;
    position: fixed;
    left: 16px;
    bottom: 16px;
    top: 16px;
    background-color: ${themeVar('overlayBackdrop')};
    backdrop-filter: blur(12px);
    color: ${themeVar('textOnAccent')};
    border: 1px solid ${themeVar('borderSubtle')};
    padding: 16px;
    z-index: 100;
    border-radius: 18px;

    display: flex;
    flex-direction: column;
    gap: 12px;
`
