import '../../style.css'
import './navigation.css'
import groupForm, {Form } from './forms.js'
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap'
import React from 'react'
import { FormTab } from '../../app.jsx'

interface RibbonNavigationInterface {
    tabs: FormTab[]
    setTabs: React.Dispatch<React.SetStateAction<FormTab[]>>
    setActiveForm: React.Dispatch<React.SetStateAction<FormTab>>
}
export default function RibbonNavigation({tabs, setTabs, setActiveForm}: RibbonNavigationInterface) {

    const handleClick = (form: FormTab) => {
        //check whether tab is already open
        const tabsId: string[] = tabs.map(t => t.id)
        const isFormOpen: boolean = tabsId.includes(form.id)

        // add new Tab
        const addTabs: FormTab[] = [...tabs, ...(isFormOpen ? [] : [{ name: form.name, id: form.id}])]
        setActiveForm(form) 
        setTabs(addTabs) 
    }  

    function Groups() {
        
        function Forms({forms}: {forms: Form[]}) {
            const formsList = forms.map(f => {
                return (
                    <NavDropdown.Item key={f.id} onClick ={() =>handleClick(f)} >
                        {f.name}
                    </NavDropdown.Item>
                )
            }
            )
            return (
                <>
                    {formsList}
                </>
            )
        }

        const groupList = groupForm.map(g => {
            if (g.forms.length === 1) {
                return (
                    <Nav.Link key={g.id} onClick={() => handleClick(g.forms[0])}>
                        {g.forms[0].name}
                    </Nav.Link>
                )
            } else {
                return (
                    <NavDropdown key={g.id} title={g.name}>
                        <Forms forms={g.forms} />
                    </NavDropdown>
                )
            }
        })
        return (
            <>
                {groupList}
            </>
        )
    }

    return (
        <Navbar key="navbar" className='bg-body-secondary justify-content-start'>
            <Container>
                <Groups />
            </Container>
        </Navbar>
    )
} 