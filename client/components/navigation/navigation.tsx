import '../../style.css'
import './navigation.css'
import {Row} from 'react-bootstrap'
import RibbonNavigation from './ribbon.navigation.jsx'
import TabsNavigation from './tabs.navigation.jsx'
import React from 'react'
import { FormTab } from '../../app.jsx'

interface NavigationInterface {
    tabs: FormTab[]
    setTabs: React.Dispatch<React.SetStateAction<FormTab[]>>
    activeForm: FormTab
    setActiveForm: React.Dispatch<React.SetStateAction<FormTab>>
}

export default function Navigation({tabs, setTabs, activeForm, setActiveForm}: NavigationInterface) {

    return (
        <>
            <Row>
                <RibbonNavigation 
                    tabs={tabs} setTabs={setTabs} 
                    setActiveForm= {setActiveForm}   
                />
            </Row>
            <Row>
                <TabsNavigation 
                    tabs={tabs} setTabs={setTabs}  
                    activeForm = {activeForm} setActiveForm={setActiveForm}
                />
            </Row>
        </>
    )
} 