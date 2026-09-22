import React from 'react'
import styled, { css } from 'styled-components'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { themeVar } from 'igoresha-dev-ui-kit'

import { Icon } from '@/ui'
import { $windowVisible, sendNewColor } from '@/features/color-picker/model/private'
import { playerColors } from '@/features/color-picker/model/conts'


export const ColorNamePicker = () => {
  const { t } = useTranslation()
  const windowVisible = useUnit($windowVisible)

  return (
    <>{windowVisible && (
      <Container>
        <Content >
          <h3><Icon icon={'color-picker'} /> {t('colorPicker.title')}</h3>
          <SettingsColors>
            {playerColors.map((color, index) =>
              <SettingsColorItem
                key={index}
                color={color}
                onClick={() => sendNewColor(color)}
              />
            )}
          </SettingsColors>
          <p>{t('colorPicker.description')}</p>
        </Content>
      </Container>
    )}
    </>
  )
}

const Container = styled.div`
  position: fixed;
  top: 16px;
  left: 386px;
  z-index: 100;
`

const Content = styled.div`
  padding: 16px;
  color: ${themeVar('textOnAccent')};
  background-color: ${themeVar('overlayBackdrop')};
  backdrop-filter: blur(12px);
  color: ${themeVar('textOnAccent')};
  border: 1px solid ${themeVar('borderSubtle')};
  border-radius: 18px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;

  h3 {
    margin-top: 4px;
    margin-bottom: 0;
  }
  animation: fadeout 0.25s ease-out forwards;
  -webkit-animation:fadeout 0.25s;
`

const SettingsColors = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`

type StylesProps = {
  color: string,
}

const SettingsColorItem = styled.button<StylesProps>`
    width: 32px;
    height: 32px;
    border: none;
    cursor: pointer;

    ${({ color }) => color && css`
        background-color: ${color};
    `}
`