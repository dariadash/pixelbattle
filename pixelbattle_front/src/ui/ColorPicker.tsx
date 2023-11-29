import React from 'react'
import styled, { css } from 'styled-components'
import { CompactPicker } from 'react-color'

type ColorPickerProps = {
    color: any,
    setColor: any
}

export const ColorPicker = ({ color, setColor }: ColorPickerProps) => {
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false)
    const [btnColor, setBtnColor] = React.useState(color.rgb || '#000000')

    const handleChangeComplete = (color) => {
        setBtnColor(color.rgb)
        setColor(color.hex)
    }
    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker)
    }

    const handleClose = () => {
        setDisplayColorPicker(false)
    }

    return (
        <div>
            <Swatch onClick={handleClick}>
                <Color style={{ background: `rgba(${btnColor.r}, ${btnColor.g}, ${btnColor.b}, ${btnColor.a})` }} />
            </Swatch>
            {displayColorPicker ?
                <Popover>
                    <Cover onClick={handleClose} />
                    <CompactPicker
                        color={color}
                        onChangeComplete={handleChangeComplete}
                    />
                </Popover> : null}
        </div>
    )
}


const Swatch = styled.div`
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    display: inline-block;
    cursor: pointer;
`

const Color = styled.div`
    width: 36px;
    height: 14px;
    border-radius: 2px;
    background: #000000;
`

const Popover = styled.div`
    position: absolute;
    z-index: 2;
`

const Cover = styled.div`
    position: fixed;
    inset: 0px;
`