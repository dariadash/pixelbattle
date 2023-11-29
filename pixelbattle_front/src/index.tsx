import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { App } from './App'
import './features/init.ts'
import './styles/style.css'

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)
root.render(
    <React.StrictMode>
        <>
            <ToastContainer />
            <App />
        </>
    </React.StrictMode>
)