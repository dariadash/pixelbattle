import React from 'react'
import { useUnit } from 'effector-react'

import { AuthPage } from '@/pages/auth-page'
import { Container, Minimap } from '@/widgets/board-area'
import { Chat, ChatSettings } from '@/widgets/chat'
import { ColorNamePicker } from '@/widgets/color-picker'
import { Header } from '@/widgets/header'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { WhoIsOnline } from '@/widgets/online-list'
import { $authChecked, $isAuthorized, $loading, initApp } from '@/features/auth/model'
import { Loader } from '@/shared/ui'


export function App() {
    const [isAuthorized, authChecked, loading] = useUnit([$isAuthorized, $authChecked, $loading])

    React.useEffect(() => {
        initApp()
    }, [])

    if (!authChecked || loading) return <Loader />
    if (!isAuthorized) return (<><AuthPage /><LanguageSwitcher /></>)

    return (
        <div>
            <Header />
            <Chat />
            <ChatSettings />
            <WhoIsOnline />
            <ColorNamePicker />
            <Container />
            <Minimap />
            <LanguageSwitcher />
        </div>
    )
}
