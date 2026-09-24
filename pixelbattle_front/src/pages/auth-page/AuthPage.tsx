import React from 'react'
import { styled } from 'styled-components'
import { useUnit } from 'effector-react'
import { themeVar } from 'igoresha-dev-ui-kit'

import { $authPage } from '@/features/auth/model'
import { LoginForm, RegisterForm } from '@/features/auth/view'

export const AuthPage = () => {
    const authPage = useUnit($authPage)
    return (
        <Container>
            {authPage === 'login' && <LoginForm />}
            {authPage === 'register' && <RegisterForm />}
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
    background-color: ${themeVar('overlayBackdrop')};
    backdrop-filter: blur(12px);
`