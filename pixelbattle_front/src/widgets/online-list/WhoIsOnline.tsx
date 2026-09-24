import React from 'react'
import styled from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { themeVar } from 'igoresha-dev-ui-kit'

import { Button, ButtonsWrapper, Icon } from '@/shared/ui'
import { $playerListVisible, $players, getCurrentPlayers, toggleList } from '@/features/player-list/model'
import { toggleWindow } from '@/features/color-picker/model'
import { UserItem } from './UserItem'

export const WhoIsOnline = () => {
    const { t } = useTranslation()
    const [playerListVisible, players] = useUnit([$playerListVisible, $players])
    React.useEffect(() => {
        if (playerListVisible) {
            getCurrentPlayers()
        }
    }, [playerListVisible])
    if (!playerListVisible) {
        return null
    }
    return (
        <Container>
            <ButtonsWrapper>
                <h2>{t('players.title')}</h2>
                <HeaderActions>
                    <Button onClick={() => toggleWindow()} size='small'>
                        <Icon icon='settings' />
                    </Button>
                    <Button onClick={toggleList} size='small'>
                        <Icon icon="close" />
                    </Button>
                </HeaderActions>
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

const HeaderActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
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
