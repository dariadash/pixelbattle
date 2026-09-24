import React from 'react'
import styled from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { Modal, Range, Switch, themeVar } from 'igoresha-dev-ui-kit'

import {
    $chatFont,
    $chatFontSize,
    changeFont,
    setFontSize,
    $chatSettingsVisible,
    toggleSettingsChat
} from '@/features/chat/model'

export const ChatSettings = () => {
    const { t } = useTranslation()
    const [fontSize, pixelFont, visible] = useUnit([$chatFontSize, $chatFont, $chatSettingsVisible])

    return (
        <Modal visible={visible} onClose={() => toggleSettingsChat()} style={{ zIndex: 200 }}>
            <SettingsTitle>{t('chat.settings')}</SettingsTitle>
            <SettingRow>
                <span>{t('chat.fontSize', { size: fontSize })}</span>
                <Range
                    min={10}
                    max={24}
                    step={1}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                />
            </SettingRow>
            <SettingRow>
                <span>{t('chat.pixelFont')}</span>
                <Switch checked={pixelFont} onChange={() => changeFont()} />
            </SettingRow>
        </Modal>
    )
}

const SettingsTitle = styled.h3`
    margin: 0 0 16px;
    color: ${themeVar('textPrimary')};
`

const SettingRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    color: ${themeVar('textSecondary')};
`
