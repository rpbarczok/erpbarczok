import { OpenPage } from "components/App.jsx"
import { FunctionComponent } from "react"
import { CloseButton, Nav } from "react-bootstrap"
import { insertInArray } from "utils/insertInArray.js"

interface NavarTabsProps {
    openPages: OpenPage[]
    setOpenPages: React.Dispatch<React.SetStateAction<OpenPage[]>>
    activePage: OpenPage
    setActivePage: React.Dispatch<React.SetStateAction<OpenPage>>
}


export const NavbarTabs: FunctionComponent<NavarTabsProps> = ({
    openPages,
    setOpenPages,
    activePage,
    setActivePage }) => {

    const closePage = (e: React.MouseEvent, open: OpenPage) => {
        e.preventDefault()
        if (openPages.length === 1) {
            setOpenPages([{ name: 'Home', id: 'home' }])
            setActivePage({ name: 'Home', id: 'home' })
        } else if (open.id !== activePage.id) {
            const newList = openPages.filter(page => page.id !== open.id)
            setOpenPages(newList)
        } else {
            const placeOfActive = openPages.indexOf(open)
            const newList = openPages.filter(page => page.id !== open.id)
            if (placeOfActive === openPages.length - 1) {
                const newActive = openPages[placeOfActive - 1]
                setActivePage(newActive)
            } else {
                const newActive = openPages[placeOfActive + 1]
                setActivePage(newActive)
            }
            setOpenPages(newList)
        }
    }

    const dragstartHandler = (e: React.DragEvent<HTMLElement>) => {
        e.dataTransfer.setData('text', e.currentTarget.id)
    }

    const dragoverHandler = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
    }

    const enableDropping = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        const sourceId = e.dataTransfer.getData('text')
        const targetId = e.currentTarget.id
        const source = openPages.find(page => page.id === sourceId)
        const target = openPages.find(page => page.id === targetId)
        if (source && target) {
            const targetIndex = openPages.findIndex(page => page === target)
            const newListPrep = openPages.filter(page => page.id !== sourceId)
            const newList = insertInArray(newListPrep, source, targetIndex)
            setOpenPages(newList)
        }
    }

    const OpenPages = () => {
        return openPages.map(open => {
            return (<Nav.Item id={open.id} key={open.id} draggable onDragStart={dragstartHandler} onDragOver={dragoverHandler} onDrop={enableDropping}>
                <Nav.Link active={activePage.id === open.id}>
                    <span onClick={() => setActivePage({ name: open.name, id: open.id })}>{open.name}</span>
                    <CloseButton onClick={(e) => closePage(e, open)} />

                </Nav.Link>
            </Nav.Item>)
        })
    }
    return (<Nav variant="tabs">
        <OpenPages />
    </Nav>
    )
}