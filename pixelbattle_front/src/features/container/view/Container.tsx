import React from 'react'
import styled, { css } from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { themeVar } from 'igoresha-dev-ui-kit'

import { Board } from '@/features/board/view'
import { $color, setColor } from '../model/public'
import { ColorPicker } from '@/ui'
import { $drawingBlocked, $timeRemaining } from '@/features/board/model'

export const Container = () => {
    const { t } = useTranslation()
    const [color, drawingBlocked, timeRemaining] = useUnit([$color, $drawingBlocked, $timeRemaining])

    return (
        <ContainerWrapper>
            <PickerContainer>
                <ColorPickerWrapper>
                    {t('container.selectColor')} &nbsp;
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                    />
                </ColorPickerWrapper>
                <p>{t('container.timeRemaining', { time: timeRemaining })}</p>
            </PickerContainer>
            <BoardContainer blockcanvas={drawingBlocked}>
                <Board />
            </BoardContainer>
        </ContainerWrapper>
    )
}

type StyledProps = {
    blockcanvas: boolean,
}

const ContainerWrapper = styled.div`
    padding: 10px;
    height: 92vh;
    display: flex;
    flex-direction: column;
    background: ${themeVar('surfaceSelected')};
    color: ${themeVar('textPrimary')};
`

const PickerContainer = styled.div`
    text-align: center;
    color: ${themeVar('textSecondary')};
`

const ColorPickerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const BoardContainer = styled.div<StyledProps>`
    background: ${themeVar('surfaceBase')};
    border: 1px solid ${themeVar('borderSubtle')};
    border-radius: 12px;
    overflow: auto;

    ${({ blockcanvas }) => blockcanvas && css`
        cursor: wait;
    `}
`