import {Nav} from 'react-bootstrap'
import {XLg} from 'react-bootstrap-icons'
import '../../style.css'
import React, { EventHandler } from 'react'
import { FormTab } from '../../app.js'

interface TabsNavigationInterface {
    tabs: FormTab[]
    setTabs: React.Dispatch<React.SetStateAction<FormTab[]>>
    setActiveForm: React.Dispatch<React.SetStateAction<FormTab>>
    activeForm: FormTab
}


export default function TabsNavigation({ tabs, setTabs, setActiveForm, activeForm }: TabsNavigationInterface) {

    const handleClose = (tab: FormTab) => {
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

    const handleClick = (tab: FormTab) => {
        setActiveForm(tab)
    }

    function handleDragStart(e: React.DragEvent<HTMLElement>) {
        console.log(e.target)
        const id: string= (e.target as HTMLElement).id
        e.dataTransfer.setData("text", id)
    }

    function handleDrop(e: React.DragEvent<HTMLElement>) {
        const indexDraggedFrom = e.dataTransfer.getData("text")
        const draggedFrom = tabs[e.dataTransfer.getData("text")]
        const indexDroppedOn = e.currentTarget.id
        const newList = tabs.map((tab, index) => {
            if (Number(indexDroppedOn) > Number(indexDraggedFrom)) {
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

    function allowDrop(e: React.DragEvent<HTMLElement>) {
        e.preventDefault()
    }

    const Tabs = () => {

        const openForms = tabs.map((tab, index) => { 
            const tabName = tab.name + " "
            if (tab.id === activeForm.id) {
                return (
                    <Nav.Item key={tab.id} id={index.toString()} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={allowDrop} onDragEnter={allowDrop}>
                        <Nav.Link active draggable={false}>
                            <span role="button" onClick={() => handleClick(tab)}>{tabName}</span>
                            <span role="button" onClick={() => handleClose(tab)}><XLg /></span>
                        </Nav.Link>
                    </Nav.Item>
                )
            } else {
                return (
                    <Nav.Item key={tab.id} id={index.toString()} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={allowDrop} onDragEnter={allowDrop}>
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