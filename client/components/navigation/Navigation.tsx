import { FormTab } from './ribbon.js'
import { NavigationRibbon } from './NavigationRibbon.jsx'
import { NavigationTabs } from './NavigationTabs.jsx'
import { Row } from 'react-bootstrap'
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
            <NavigationRibbon
                tabs={tabs} setTabs={setTabs}
                setActiveForm={setActiveForm}
                theme={theme} setTheme={setTheme}
            />
            <Row>
                <NavigationTabs
                    tabs={tabs} setTabs={setTabs}
                    activeForm={activeForm} setActiveForm={setActiveForm}
                />
            </Row>
        </>
    )
} 