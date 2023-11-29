import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
    name: string
    color: string
    socketId: string
}
export const UserItem: React.FC<Props> = ({ name, color, socketId }) => {
    return (
        <Container color={color}>
            <Title>{name}</Title>
            <Description>{socketId}</Description>
        </Container >
    )
}

type ContainerProps = {
    color: string
}

const Container = styled.div<ContainerProps>`
    font-size: 24px;
    ${({ color }) => color && css`
        color: ${color};
    `}
`

const Title = styled.div`
    font-size: 24px;
`

const Description = styled.div`
    font-size: 14px;
    color: #fff;
`
