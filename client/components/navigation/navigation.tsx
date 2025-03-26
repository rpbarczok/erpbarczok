import { Row } from 'react-bootstrap'
import { RibbonNavigation } from './ribbon.navigation.jsx'
import { TabsNavigation } from './tabs.navigation.jsx'
import React from 'react'
import { FormTab } from './ribbon.js'
import { Theme } from './toggleTheme.js'

interface NavigationInterface {
    tabs: FormTab[]
    setTabs: React.Dispatch<React.SetStateAction<FormTab[]>>
    activeForm: FormTab
    setActiveForm: React.Dispatch<React.SetStateAction<FormTab>>
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

export function Navigation({ tabs, setTabs, activeForm, setActiveForm, theme, setTheme }: NavigationInterface) {

    return (
        <>
            <RibbonNavigation
                tabs={tabs} setTabs={setTabs}
                setActiveForm={setActiveForm}
                theme={theme} setTheme={setTheme}
            />
            <Row>
                <TabsNavigation
                    tabs={tabs} setTabs={setTabs}
                    activeForm={activeForm} setActiveForm={setActiveForm}
                />
            </Row>
        </>
    )
} 