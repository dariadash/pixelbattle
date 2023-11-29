import { $color, setColor } from './public'

$color
    .on(setColor, (_, s) => s)
