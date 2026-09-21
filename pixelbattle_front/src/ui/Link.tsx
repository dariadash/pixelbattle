import { styled } from 'styled-components'
import { themeVar, type Theme } from 'igoresha-dev-ui-kit'

type ThemeColor = keyof Theme

type LinkProps = {
    $color?: ThemeColor,
    $hoverColor?: ThemeColor,
}

export const Link = styled.button<LinkProps>`
    font-size: 16px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    
    color: ${({ theme, $color }) => ($color ? theme[$color] : themeVar('actionPrimary')({ theme }))};
    &:hover {
        color: ${({ theme, $hoverColor }) => ($hoverColor ? theme[$hoverColor] : themeVar('actionPrimaryHover')({ theme }))};
    }
`