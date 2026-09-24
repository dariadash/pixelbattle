import React from 'react'
import styled, { css } from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { themeVar } from 'igoresha-dev-ui-kit'

import { ColorPicker } from '@/shared/ui'
import { Board } from '@/features/board/view'
import { $drawingBlocked, $timeRemaining } from '@/features/board/model'
import { $color, setColor } from '@/features/container/model'

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
            <BoardContainer id='board-scroll-container' blockcanvas={drawingBlocked}>
                <Board />
            </BoardContainer>
        </ContainerWrapper>
    )
}

type StyledProps = {
    blockcanvas: boolean,
}

const ContainerWrapper = styled.div`
    position: relative;
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
    scrollbar-width: thin;
    scrollbar-color: ${themeVar('scrollbarThumb')} transparent;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${themeVar('scrollbarThumb')};
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${themeVar('scrollbarThumbHover')};
    }
    &::-webkit-scrollbar-corner {
        background: transparent;
    }

    ${({ blockcanvas }) => blockcanvas && css`
        cursor: wait;
    `}
`