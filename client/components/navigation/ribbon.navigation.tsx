import groupForm from './forms.js'
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap'
import '../../style.css'

export default function RibbonNavigation({tabs, setTabs, setActiveForm}) {

    const handleClick = (form) => {
        //check whether tab is already open
        const tabsId = tabs.map(t => t.id)
        const isFormOpen = tabsId.includes(form.id)

        // add new Tab
        const addTabs = [...tabs, ...(isFormOpen ? [] : [{ name: form.name, id: form.id}])]
        setActiveForm(form) 
        setTabs(addTabs) 
    }  

    function Groups() {
        
        function Forms({ forms }) {
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