import { OpenPage } from "components/App.jsx"
import { CloseButton, Nav } from "react-bootstrap"

interface NavarTabsInterface {
    openPages: OpenPage[]
    setOpenPages: React.Dispatch<React.SetStateAction<OpenPage[]>>
    activePage: OpenPage
    setActivePage: React.Dispatch<React.SetStateAction<OpenPage>>
}


export const NavbarTabs = ({
    openPages,
    setOpenPages,
    activePage,
    setActivePage }: NavarTabsInterface) => {

    const closePage = (open: OpenPage) => {
        if (openPages.length === 1) {
            setOpenPages([{name:'Home', id: 'home'}])
            setActivePage({name:'Home', id: 'home'})
        } else if (open.id !== activePage.id) {
            const newList = openPages.filter(page => page.id !== open.id)
            setOpenPages(newList)
        } else {
            const placeOfActive = openPages.indexOf(open)
            const newList = openPages.filter(page => page.id !== open.id)
            if (placeOfActive === openPages.length -1) {
                const newActive = openPages[placeOfActive-1]
                setActivePage(newActive)
            } else {
                const newActive = openPages[placeOfActive+1]
                setActivePage(newActive)
            }
            setOpenPages(newList)
        }
    }

    const OpenPages = () => {
        return openPages.map(open => {
            return (<Nav.Item key={open.id}  >
                <Nav.Link active={activePage.id === open.id}><span onClick={() => { setActivePage({ name: open.name, id: open.id }) }}>{open.name}</span> <CloseButton onClick={() => {closePage(open)}} /></Nav.Link>
            </Nav.Item>)
        })
    }
    return (<Nav variant="tabs">
        <OpenPages />
    </Nav>
    )
}