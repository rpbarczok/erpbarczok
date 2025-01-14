import {Row} from 'react-bootstrap'
import RibbonNavigation from './ribbon.navigation.js'
import TabsNavigation from './tabs.navigation.js'
import '../../style.css'

export default function Navigation({tabs, setTabs, activeForm, setActiveForm}) {

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