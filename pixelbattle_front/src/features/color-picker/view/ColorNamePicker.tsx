import React from 'react'
import styled, { css } from 'styled-components'
import { useStore } from 'effector-react'

import { Icon } from '@/ui'
import { $windowVisible } from '@/features/color-picker/model/private'
import { playerColors } from '@/features/color-picker/model/conts'
import { sendNewColor } from '@/features/color-picker/model'


export const ColorNamePicker = () => {
  const windowVisible = useStore($windowVisible)

  return (
    <>{windowVisible && (
      <Container>
        <Content >
          <h3><Icon icon={'color-picker'} /> Зелья изменения цвета</h3>
          <SettingsColors>
            {playerColors.map((color, index) =>
              <SettingsColorItem
                key={index}
                color={color}
                onClick={() => sendNewColor(color)}
              />
            )}
          </SettingsColors>
          <p>Поменяйте цвет Капи. Новый цвет сохранится на вашем аккаунте, другие игроки увидят ваш новый цвет.</p>
        </Content>
      </Container>
    )}
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 460px;
  right: 0;
  top: 0;
`

const Content = styled.div`
  padding: 16px;
  color: white;
  background-color: rgba(0,0,0,0.8);
  box-sizing: border-box;
  z-index: 100;
  box-shadow: 0 0 5px -15px rgba(0,0,0,0.9);
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;

  h3 {
    margin-top: 4px;
    margin-bottom: 0;
  }
  animation: fadeout 0.5s ease-out forwards;
  -webkit-animation:fadeout 0.5s;
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

const SettingsColorItem = styled.div<StylesProps>`
    width: 32px;
    height: 32px;
    cursor: pointer;

    ${({ color }) => color && css`
        background-color: ${color};
    `}
`