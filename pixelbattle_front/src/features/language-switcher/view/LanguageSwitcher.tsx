import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Button } from '@/ui/Button'
import i18n from '@/lib/i18n'

const LANGS = ['ru', 'en'] as const

export const LanguageSwitcher = () => {
    const { i18n: instance } = useTranslation()
    const current = (instance.language || 'ru').split('-')[0]

    return (
        <Switcher>
            {LANGS.map((lng) => (
                <Button
                    key={lng}
                    size='small'
                    variant={current === lng ? 'primary' : 'default'}
                    onClick={() => i18n.changeLanguage(lng)}
                >
                    {lng.toUpperCase()}
                </Button>
            ))}
        </Switcher>
    )
}

const Switcher = styled.div`
    position: fixed;
    right: 16px;
    top: 72px;
    z-index: 100;
    display: flex;
    gap: 8px;
`
