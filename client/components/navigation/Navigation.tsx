import { OpenPage } from '../App.js'
import { NavbarMenue } from './NavbarMenue.jsx'
import { NavbarTabs } from './NavbarTabs.jsx'

interface NavigationInterface {
    openPages: OpenPage[]
    setOpenPages: React.Dispatch<React.SetStateAction<OpenPage[]>>
    activePage: OpenPage
    setActivePage: React.Dispatch<React.SetStateAction<OpenPage>>
    theme: 'light' | 'dark'
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
}

export const Navigation = ({ openPages, setOpenPages, activePage, setActivePage, theme, setTheme }: NavigationInterface) => {
    return <>
        <NavbarMenue
            openPages={openPages} setOpenPages={setOpenPages}
            activePage={activePage} setActivePage={setActivePage}
            theme={theme} setTheme={setTheme}
        />
        <NavbarTabs
            openPages={openPages} setOpenPages={setOpenPages}
            activePage={activePage} setActivePage={setActivePage}
        />
    </>
}
