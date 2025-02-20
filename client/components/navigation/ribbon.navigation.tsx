import '../../style.css'
import './navigation.css'
import { groupForm, Form, FormTab } from './ribbon.js'
import { Navbar, Nav, NavDropdown, Container, Col, Button } from 'react-bootstrap'
import React from 'react'
import { useAuth } from 'react-oidc-context'

interface RibbonNavigationInterface {
    tabs: FormTab[]
    setTabs: React.Dispatch<React.SetStateAction<FormTab[]>>
    setActiveForm: React.Dispatch<React.SetStateAction<FormTab>>
}

export function RibbonNavigation({ tabs, setTabs, setActiveForm }: RibbonNavigationInterface) {

    const auth = useAuth()

    const handleClick = (form: FormTab) => {
        //check whether tab is already open
        const tabsId: string[] = tabs.map(t => t.id)
        const isFormOpen: boolean = tabsId.includes(form.id)

        // add new Tab
        const addTabs: FormTab[] = [...tabs, ...(isFormOpen ? [] : [form])]
        setTabs(addTabs)
        setActiveForm(form)
    }

    function Groups() {

        function Forms({ forms }: { forms: Form[] }) {
            const formsList = forms.map(f => {
                return (
                    <NavDropdown.Item  key={f.id} onClick={() => handleClick(f)} >
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

        const groupFormAuth = groupForm.map(g => {
            const userScope = ["public"]
            if  (auth.user?.scopes) {
                const scopes = auth.user?.scopes
                userScope.concat(scopes)
            }
            const groupFormsAuth = g.forms.filter(f => {
                f.scopes.split(" ").some(e => userScope.includes(e))
            })
            return {...g, forms: groupFormsAuth}
        })

        const groupList = groupFormAuth.map(g => {
            if (g.forms.length !==0) {
                if (g.forms.length === 1) {
                    return (
                        <Nav.Link className="ribbonDesign" key={g.id} onClick={() => handleClick(g.forms[0])}>
                            {g.forms[0].name}
                        </Nav.Link>
                    )
                } else {
                    return (
                        <NavDropdown key={g.id} className="ribbonDesign" title={g.name}>
                            <Forms forms={g.forms} />
                        </NavDropdown>
                    )
                }
            }
        })
        return (
            <>
                {groupList}
            </>
        )
    }

    const logOutHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await auth.revokeTokens()
        await auth.removeUser()
    }

    const LoginInfo = () => {
        return (
            <div className="ms-auto ribbonDesign">
                Logged in as {auth.user?.profile?.sub?.split("|")[1]} <Button className="standardDesign" variant="outline-primary" onClick={logOutHandler}>Log out</Button>
            </div>
        )
    }
    return (
        <Navbar key="navbar" className='bg-body-secondary justify-content-start'>
            <Groups />
            <LoginInfo />
        </Navbar>
    )
} 