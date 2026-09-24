import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, GlobalStyled as KitGlobalStyled } from 'igoresha-dev-ui-kit'
import { App } from './app/App'
import './shared/lib/i18n'
import './init'
import './app/styles.css'

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)
const GlobalStyled = KitGlobalStyled as unknown as React.FC
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <GlobalStyled />
            <ToastContainer />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
