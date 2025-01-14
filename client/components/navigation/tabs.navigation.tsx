import {Nav} from 'react-bootstrap'
import {XLg} from 'react-bootstrap-icons'
import '../../style.css'

export default function TabsNavigation({ tabs, setTabs, setActiveForm, activeForm }) {

    const handleClose = (tab) => {
        console.log(tab)
        const index = tabs.indexOf(tab)
        if (tabs.length > 1) {
            setTabs(tabs.toSpliced(index, 1))
            if (tab === activeForm) {
                if (index === tabs.length - 1) {
                    setActiveForm(tabs[index - 1])
                } else {
                    setActiveForm(tabs[index + 1])
                }
            }
        }
    }

    const handleClick = (tab) => {
        setActiveForm(tab)
    }

    function handleDragStart(e) {
        e.dataTransfer.setData("text", e.target.id)
    }

    function handleDrop(e) {
        const indexDraggedFrom = e.dataTransfer.getData("text")
        const draggedFrom = tabs[e.dataTransfer.getData("text")]
        const indexDroppedOn = e.currentTarget.id
        const newList = tabs.map((tab, index) => {
            if (indexDroppedOn > Number(indexDraggedFrom)) {
                if (index > Number(indexDroppedOn) || index < Number(indexDraggedFrom)) {
                    return tab
                } else if (index === Number(indexDroppedOn)) {
                    return draggedFrom
                } else {
                    return tabs[index + 1]
                }
            } else {
                if (index < Number(indexDroppedOn) || index > Number(indexDraggedFrom)) {
                    return tab
                } else if (index === Number(indexDroppedOn)) {
                    return draggedFrom
                } else {
                    return tabs[index - 1]
                }
            }
        })

        setTabs(newList)
    }

    function allowDrop(e) {
        e.preventDefault()
    }

    const Tabs = () => {

        const openForms = tabs.map((tab, index) => {
            const tabName = tab.name + " "
            if (tab.id === activeForm.id) {
                return (
                    <Nav.Item key={tab.id} id={index} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={allowDrop} onDragEnter={allowDrop}>
                        <Nav.Link active draggable={false}>
                            <span role="button" onClick={() => handleClick(tab)}>{tabName}</span>
                            <span role="button" onClick={() => handleClose(tab)}><XLg /></span>
                        </Nav.Link>
                    </Nav.Item>
                )
            } else {
                return (
                    <Nav.Item key={tab.id} id={index} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={allowDrop} onDragEnter={allowDrop}>
                        <Nav.Link draggable={false} >
                            <span role="button" onClick={() => handleClick(tab)} >{tabName}</span>
                            <span role="button" onClick={() => handleClose(tab)} ><XLg /></span>
                        </Nav.Link>
                    </Nav.Item>
                )
            }
        })
        return openForms
    }

    return (
        <Nav variant="tabs" >
            <Tabs />
        </Nav>
    )
} 