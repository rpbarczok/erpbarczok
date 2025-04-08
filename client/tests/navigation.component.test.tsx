import { expect } from 'expect';
import { PermissionContext } from '../utils/permissionContext.js';
import { render } from './utils/contextWrapper.js';
import { screen } from '@testing-library/react';
import { OpenPage } from 'components/App.js';
import { NavbarMenue } from 'components/navigation/NavbarMenue.js';
import { NavbarTabs } from 'components/navigation/NavbarTabs.js';

const startPage: OpenPage = { name: 'Stammdaten', id: 'stammPage' }
const anfPage: OpenPage = { name: 'Anfragen', id: 'anfPage' }

const groupsListPublic = [
    "Startseite",
    "Stammdaten",
    "Artikel",
    "Aufträge",
    "Reklamationen",
    "Lieferungen",
    "Spedition/ER",
    "Rechnungen"
]

const groupsListUser = [...groupsListPublic]

const groupsListAdmin = [...groupsListUser, "Resources"]

const permissionGroups = {
    public: groupsListPublic,
    user: groupsListUser,
    admin: groupsListAdmin
}

const forbiddenGroupsAdmin = []
const forbiddenGroupsUser = [...forbiddenGroupsAdmin]
const forbiddenGroupsPublic = [...forbiddenGroupsUser]

const forbiddenGroups = {
    public: forbiddenGroupsPublic,
    user: forbiddenGroupsUser,
    admin: forbiddenGroupsAdmin
}

// eslint-disable-next-line
const noop = () => { }

describe('Navigation Component Test', function() {

    describe('Navigation Ribbon Test with permissions"', function() {

        // Arrange
        const openPages = [startPage]
        const theme = 'light'

        for (const permission in permissionGroups) {

            it(`displays the ribbon navigation for ${permission}`, function() {
                // Act
                render(
                    <PermissionContext.Provider value={{ permissions: [permission], setPermissions: noop }}>
                        <NavbarMenue
                            openPages={openPages} setOpenPages={noop}
                            activePage={openPages[0]} setActivePage={noop}
                            theme={theme} setTheme={noop}
                        />
                    </PermissionContext.Provider>
                )

                // Assert
                for (const group of permissionGroups[permission]) {
                    expect(screen.getByText(group as string)).not.toBeNull()
                }

                for (const group of forbiddenGroups[permission]) {
                    expect(screen.queryByText(group as string)).toBeNull()
                }
            })
        }
    })

    describe('displays the tab navigation', function() {
        it('displays the tab navigation', function() {
            // Arrange
            const openPages = [startPage, anfPage]
            const activePage = anfPage
            // Act
            render( 
                <NavbarTabs
                    openPages={openPages} setOpenPages={noop}
                    activePage={activePage} setActivePage={noop}
            />
            )
            // Assert 
            expect(screen.getByText('Anfragen')).not.toBeNull()
            expect(screen.getByText('Stammdaten')).not.toBeNull()
            expect(document.getElementsByClassName('active')[0].textContent).toBe('Anfragen')
        })

    })
})