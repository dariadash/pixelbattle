import React from 'react'
import { useUnit } from 'effector-react'
import styled from 'styled-components'
import { Modal, Range, Switch, themeVar } from 'igoresha-dev-ui-kit'
import { $chatFont, $chatFontSize, changeFont, setFontSize } from '../model/private'
import { $chatSettingsVisible, toggleSettingsChat } from '../model'

export const ChatSettings = () => {
    const [fontSize, pixelFont, visible] = useUnit([$chatFontSize, $chatFont, $chatSettingsVisible])

    return (
        <Modal visible={visible} onClose={() => toggleSettingsChat()} style={{ zIndex: 200 }}>
            <SettingsTitle>Настройки чата</SettingsTitle>
            <SettingRow>
                <span>Размер шрифта: {fontSize}px</span>
                <Range
                    min={10}
                    max={24}
                    step={1}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                />
            </SettingRow>
            <SettingRow>
                <span>Пиксельный шрифт</span>
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
