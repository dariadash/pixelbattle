import { styled } from 'styled-components'
import { themeVar } from 'igoresha-dev-ui-kit'

export const Form = styled.form`
    display: flex;
    flex-flow: column;
    justify-content: center;
    gap: 24px;
    color: ${themeVar('textPrimary')};
    min-width: 465px;
    padding: 20px;
    border-radius: 18px;
    background-color: ${themeVar('surfaceElevated')};
    border: 1px solid ${themeVar('borderSubtle')};
    backdrop-filter: blur(12px);
`
