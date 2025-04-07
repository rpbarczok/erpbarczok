import { expect } from 'expect';
import { PageTab } from '../components/navigation_alt/ribbon.js';
import { NavigationRibbon } from '../components/navigation_alt/NavigationRibbon.js';
import { NavigationTabs } from 'components/navigation_alt/NavigationTabs.js';
import { PermissionContext } from '../utils/permissionContext.js';
import { render } from './utils/contextWrapper.js';
import { screen } from '@testing-library/react';

const startPage: PageTab = { name: 'Stammdaten', id: 'stammPage' }
const anfPage: PageTab = { name: 'Anfragen', id: 'anfPage' }

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

describe('Navigation Component Test', (): void => {

    describe('Navigation Ribbon Test with permissions"', (): void => {

        // Arrange
        const tabs = [startPage]
        const theme = 'light'

        for (const permission in permissionGroups) {

            it(`displays the ribbon navigation for ${permission}`, async (): Promise<void> => {
                // Act
                render(
                    <PermissionContext.Provider value={{ permissions: [permission], setPermissions: noop }}>
                        <NavigationRibbon
                            tabs={tabs} setTabs={noop}
                            setActivePage={noop}
                            theme={theme} setTheme={noop}
                        />
                    </PermissionContext.Provider>
                )

                // Assert
                for (const group of permissionGroups[permission]) {
                    expect(screen.getByText(group)).not.toBeNull()
                }

                for (const group of forbiddenGroups[permission]) {
                    expect(screen.queryByText(group)).toBeNull()
                }
            })
        }
    })

    describe('displays the tab navigation', (): void => {
        it('displays the tab navigation', async (): Promise<void> => {
            // Arrange
            const tabs = [startPage, anfPage]
            const activePage = anfPage
            // Act
            render( 
                <NavigationTabs
                    tabs={tabs} setTabs={noop}
                    activePage={activePage} setActivePage={noop}
            />
            )
            // Assert 
            expect(screen.getByText('Anfragen')).not.toBeNull()
            expect(screen.getByText('Stammdaten')).not.toBeNull()
            expect(document.getElementsByClassName('active')[0].textContent).toBe('Anfragen ')
        })

    })
})