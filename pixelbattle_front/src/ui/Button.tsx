import React from 'react'
import styled, { css } from 'styled-components'

type ButtonProps = {
    onClick?: () => void,
    type?: 'submit' | 'button' | 'reset',
    blockBtn?: boolean,
    size?: 'small' | 'medium' | 'large',
    children: React.ReactNode
}

export const Button = ({
    children,
    type,
    onClick,
    blockBtn = false,
    size = 'medium' }: ButtonProps
) => {
    return (
        <Container type={type} onClick={onClick} blockbtn={blockBtn} size={size}>
            {children}
        </Container>
    )
}

type StyledProps = {
    blockbtn: boolean,
    size?: string,
}

const Container = styled.button<StyledProps>`
    display: flex;
    align-items: center;
    justify-content: center;

    text-decoration: none;
    gap: 12px;

    font-size: 18px;
    padding: 12px;
    background-color: #00000050;
    backdrop-filter: blur(12px);
    color: #fff;
    border-radius: 6px;
    border: none;
    cursor: pointer;

    &:hover {
        color: #21e421;
        text-decoration: none;
    }
    a {
        text-decoration: none;
    }

    ${({ blockbtn }) => blockbtn && css`
        max-width: 100%;
    `}

    ${({ size }) => size === 'small' && css`
        font-size: 16px;
        padding: 6px;
    `}

    ${({ size }) => size === 'large' && css`
        font-size: 32px;
        padding: 16px;
    `}
`