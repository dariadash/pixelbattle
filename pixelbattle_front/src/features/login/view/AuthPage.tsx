import React from 'react'
import { styled } from 'styled-components'
import { useStore } from 'effector-react'

import { $settingsPage } from '../model/private'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export const AuthPage = () => {
    const settingsPage = useStore($settingsPage)
    return (
        <Container>
            {settingsPage === 'login' && (
                <LoginForm />
            )}
            {settingsPage === 'register' && (
                <RegisterForm />
            )}
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000050;
    backdrop-filter: blur(12px);
`