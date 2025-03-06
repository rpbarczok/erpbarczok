import '../../style.css'
import './navigation.css'
import { groupForm, Form, FormTab } from './ribbon.js'
import { Navbar, Nav, NavDropdown, Row, Col, Dropdown } from 'react-bootstrap'
import React, { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { List } from 'react-bootstrap-icons'

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
                    <NavDropdown.Item key={f.id} onClick={() => handleClick(f)} >
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
            const userScope: string[] = auth.user?.scopes ? auth.user?.scopes.concat(['public']) : ['public']
            const groupFormsAuth = g.forms.filter(f => {
                const formScopes = new Set(f.scopes.split(" "))
                return userScope.some(scope => formScopes.has(scope))
            })
            return { ...g, forms: groupFormsAuth }
        })


        const groupList = groupFormAuth.map(g => {
            if (g.forms.length !== 0) {
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

    function GroupsNavXS() {

        function Forms({ forms }: { forms: Form[] }) {
            const formsList = forms.map(f => {
                return (
                    <NavDropdown.Item key={f.id} onClick={() => handleClick(f)} >
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
            const userScope: string[] = auth.user?.scopes ? auth.user?.scopes.concat(['public']) : ['public']
            const groupFormsAuth = g.forms.filter(f => {
                const formScopes = new Set(f.scopes.split(" "))
                return userScope.some(scope => formScopes.has(scope))
            })
            return { ...g, forms: groupFormsAuth }
        })


        const groupList = groupFormAuth.map(g => {
            if (g.forms.length !== 0) {
                if (g.forms.length === 1) {
                    return (
                        <NavDropdown.Item>
                            <Nav.Link className="dropdown-item nav-item dropdown" key={g.id} onClick={() => handleClick(g.forms[0])}>
                                {g.forms[0].name}
                            </Nav.Link>
                        </NavDropdown.Item>
                    )
                } else {
                    return (
                        <NavDropdown className="dropdown-item" key={g.id} title={g.name}>
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
        try {
            await auth.revokeTokens()
            await auth.removeUser()
        } catch (error) {
            await auth.removeUser()
            await auth.signoutRedirect()
        }
    }

    return (
        <div>
            <Row>
                <Navbar key="navbar-lg" className='bg-body-secondary d-none d-xl-block'>
                    <Nav>
                        <Groups />
                        <NavDropdown className="ms-auto" key="account" title={auth.user?.profile?.email}>
                            <NavDropdown.Item key="logout" onClick={logOutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </Row>
            <Row className='bg-body-secondary d-xl-none align-items-center' style={{ padding: '8px 0 8px 0' }}>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle bsPrefix='dropdown' variant="outline-secondary">
                            <List />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <GroupsNavXS />
                        </Dropdown.Menu>
                    </Dropdown>

                </Col>
                <Col className="ms-auto">
                    <NavDropdown className="float-end" key="account" title={auth.user?.profile?.email}>
                        <NavDropdown.Item key="logout" onClick={logOutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Col>
            </Row>
        </div>
    )
} 