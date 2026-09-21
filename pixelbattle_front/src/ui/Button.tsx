import React from 'react'
import { Button as KitButton, type ButtonSize } from 'igoresha-dev-ui-kit'

type ButtonProps = {
    onClick?: () => void,
    type?: 'submit' | 'button' | 'reset',
    blockBtn?: boolean,
    size?: ButtonSize,
    variant?: 'default' | 'primary' | 'secondary' | 'danger',
    children: React.ReactNode,
    disabled?: boolean,
}

export const Button = ({
    children,
    type = 'button',
    onClick,
    blockBtn = false,
    size = 'medium',
    variant = 'default',
    disabled,
}: ButtonProps) => {
    return (
        <KitButton
            type={type}
            onClick={onClick}
            $size={size}
            $variant={variant}
            $fullWidth={blockBtn}
            disabled={disabled}
        >
            {children}
        </KitButton>
    )
}
