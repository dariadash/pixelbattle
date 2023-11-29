import { $windowVisible } from './private'
import { closeWindow, toggleWindow } from './public'

$windowVisible
    .on(toggleWindow, (a) => !a)
    .reset(closeWindow)
