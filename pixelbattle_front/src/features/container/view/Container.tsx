import React from 'react'
import styled, { css } from 'styled-components'
import { useUnit } from 'effector-react'

import { Board } from '@/features/board/view'
import { $color, setColor } from '../model/public'
import { ColorPicker } from '@/ui'
import { $drawingBlocked, $timeRemaining } from '@/features/board/model'

export const Container = () => {
    const [color, drawingBlocked, timeRemaining] = useUnit([$color, $drawingBlocked, $timeRemaining])
    const boardContainer = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        const board = boardContainer.current
        if (!board) return
        board.style.width = `${window.innerWidth - 20}px`
        board.style.height = `${window.innerHeight - 150}px`
    }, [])


    return (
        <ContainerWrapper>
            <PickerContainer>
                <ColorPickerWrapper>
                    Select color: &nbsp;
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                    />
                </ColorPickerWrapper>
                <div>
                    Time remaining: {timeRemaining}
                </div>
            </PickerContainer>
            <BoardContainer
                blockcanvas={drawingBlocked}
                ref={boardContainer}
            >
                <Board />
            </BoardContainer>
        </ContainerWrapper>
    )
}

type StyledProps = {
    blockcanvas: boolean,
}

const ContainerWrapper = styled.div`
    padding-top: 10px;
    position: fixed;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #03a9F4, #4CAF50);
`

const PickerContainer = styled.div`
    text-align: center;
    color: white;
`

const ColorPickerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const BoardContainer = styled.div<StyledProps>`
    margin: auto;
    margin: 10px;
    background: white;
    overflow: scroll;

    ${({ blockcanvas }) => blockcanvas && css`
        cursor: wait;
    `}
`