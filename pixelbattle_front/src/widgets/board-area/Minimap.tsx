import React from 'react'
import { useUnit } from 'effector-react'
import styled from 'styled-components'
import { themeVar } from 'igoresha-dev-ui-kit'

import { Button, Icon } from '@/shared/ui'
import { CANVAS_SIZE } from '@/shared/lib/board-constants'
import { $pixels } from '@/features/board/model'

const MINI_SIZE = 250
const SECTIONS = 10

export const Minimap = () => {
    const pixels = useUnit($pixels)
    const miniRef = React.useRef<HTMLCanvasElement | null>(null)
    const [open, setOpen] = React.useState(false)

    const redraw = React.useCallback(() => {
        const mini = miniRef.current
        const main = document.getElementById('board-canvas') as HTMLCanvasElement | null
        if (!mini) {
            return
        }
        const ctx = mini.getContext('2d')
        if (!ctx || !main || !main.width) {
            return
        }
        ctx.clearRect(0, 0, MINI_SIZE, MINI_SIZE)
        ctx.drawImage(main, 0, 0, MINI_SIZE, MINI_SIZE)
    }, [])

    React.useEffect(() => {
        if (open) {
            redraw()
        }
    }, [open, pixels, redraw])

    const jumpTo = (row: number, col: number) => {
        const scroller = document.getElementById('board-scroll-container')
        if (!scroller) {
            return
        }
        const cell = CANVAS_SIZE / SECTIONS
        scroller.scrollTo({
            left: Math.max(0, col * cell + cell / 2 - scroller.clientWidth / 2),
            top: Math.max(0, row * cell + cell / 2 - scroller.clientHeight / 2),
            behavior: 'smooth',
        })
    }

    return (
        <Wrapper>
            <Button size='small' onClick={() => setOpen(!open)}>
                <Icon icon='sign' />
            </Button>
            {open && (
                <Popup>
                    <MiniCanvas ref={miniRef} width={MINI_SIZE} height={MINI_SIZE} />
                    <Grid>
                        {Array.from({ length: SECTIONS * SECTIONS }).map((_, i) => {
                            const row = Math.floor(i / SECTIONS)
                            const col = i % SECTIONS
                            return <Cell key={i} type='button' onClick={() => jumpTo(row, col)} />
                        })}
                    </Grid>
                </Popup>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 50;
`

const Popup = styled.div`
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    width: ${MINI_SIZE}px;
    height: ${MINI_SIZE}px;
    background: ${themeVar('surfaceElevated')};
    border: 1px solid ${themeVar('borderSubtle')};
    overflow: hidden;
`

const MiniCanvas = styled.canvas`
    width: 100%;
    height: 100%;
    display: block;
    image-rendering: pixelated;
`

const Grid = styled.div`
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(${SECTIONS}, 1fr);
    grid-template-rows: repeat(${SECTIONS}, 1fr);
`

const Cell = styled.button`
    background: transparent;
    border: 1px solid ${themeVar('borderSubtle')};
    padding: 0;
    cursor: pointer;

    &:hover {
        background: ${themeVar('surfaceSelected')};
        opacity: 0.7;
    }
`
