import { Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { OpenPage } from '../App.jsx'
import { Page, ribbonList } from './groups.js'
import { PermissionContext } from 'utils/permissionContext.js'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { useAuth } from 'react-oidc-context'
import { List, MoonStarsFill, SunFill } from 'react-bootstrap-icons'
import { toggleTheme } from 'components/navigation/toggleTheme.js'

interface NavbarMenueInterface {
    openPages: OpenPage[]
    setOpenPages: React.Dispatch<React.SetStateAction<OpenPage[]>>
    activePage: OpenPage
    setActivePage: React.Dispatch<React.SetStateAction<OpenPage>>
    theme: 'light' | 'dark'
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
}

export const NavbarMenue = ({
    openPages,
    setOpenPages,
    activePage,
    setActivePage,
    theme,
    setTheme }: NavbarMenueInterface) => {

    const auth = useAuth()
    const { permissions } = useContextThrowUndefined(PermissionContext)
    const authGroupList = ribbonList.filter(group => group.auth.split(' ').some(scope => permissions.includes(scope)))
    const authRibbonList = authGroupList.map(group => {
        const authPageList = group.pages.filter(form => form.auth.split(' ').some(scope => permissions.includes(scope)))
        return { ...group, pages: authPageList }
    })

    const handleClick = (e: React.MouseEvent, page: Page) => {
        e.preventDefault()
        const newPage: OpenPage = { name: page.name, id: page.id }
        if (!openPages.some(active => active.id === page.id)) {
            setOpenPages([...openPages, newPage])
        }
        if (activePage.id !== newPage.id) {
            setActivePage(newPage)
        }
    }

    const PageDropdown = ({ pages }: { pages: Page[] }) => {
        return pages.map(page => {
            return <Dropdown.Item key={page.id} onClick={(e) => handleClick(e, page)}>{page.name}</Dropdown.Item>
        })
    }

    const RibbonList = ({cssClass}: {cssClass?: string}) => {
        return authRibbonList.map(group => {
            if (group.pages.length > 0) {
                if (group.pages.length === 1) {
                    return <Nav.Link className={cssClass} key={group.pages[0].id} onClick={(e) => handleClick(e, group.pages[0]) }>{group.pages[0].name}</Nav.Link>
                } else {
                    return <NavDropdown className={cssClass} title={group.name} key={group.id}>
                        <PageDropdown pages={group.pages} />
                    </NavDropdown>
                }
            }
        })

    }

    const logOut = async () => {
        await auth.removeUser()
        await auth.signoutRedirect({ post_logout_redirect_uri: window.location.href })
    }

    const ProfileDropdown = () => {
        return (<NavDropdown drop='start' className='ms-auto' title={auth.user?.profile.email ?? auth.user?.profile.name}>
            <Dropdown.Item key='logout' onClick={logOut}>Logout</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item key='light' active={theme === 'light'} onClick={() => { toggleTheme(theme, setTheme) }}>
                <SunFill />
            </Dropdown.Item>
            <Dropdown.Item key='dark' active={theme === 'dark'} onClick={() => { toggleTheme(theme, setTheme) }}>
                <MoonStarsFill />
            </Dropdown.Item>
        </NavDropdown>

        )

    }

    return (
        <>
            <Navbar className='bg-body-tertiary d-none d-md-block'>
                <Nav className='flex-grow-1'>
                    <RibbonList />
                    <ProfileDropdown />
                </Nav>
            </Navbar>
            <Navbar className='bg-body-tertiary d-md-none' >
                <NavDropdown className='startPadding10' title={<List />} >
                    <RibbonList cssClass='startPadding10'/>
                </NavDropdown>
                <ProfileDropdown />

            </Navbar>
        </>
    )
}