import { expect } from 'expect';
import { FormTab } from '../components/navigation/ribbon.js';
import { NavigationRibbon } from '../components/navigation/NavigationRibbon.jsx';
import { NavigationTabs } from 'components/navigation/NavigationTabs.jsx';
import { PermissionContext } from '../utils/permissionContext.js';
import { render } from './utils/contextWrapper.js';
import { screen } from '@testing-library/react';

const startForm: FormTab = { name: 'Stammdaten', id: 'stammForm' }
const anfForm: FormTab = { name: 'Anfragen', id: 'anfForm' }

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

const noop = () => { }

describe('Navigation Component Test', (): void => {

    describe('Navigation Ribbon Test with permissions"', (): void => {

        // Arrange
        const tabs = [startForm]
        const theme = 'light'

        for (const permission in permissionGroups) {

            it(`displays the ribbon navigation for ${permission}`, async (): Promise<void> => {
                // Act
                render(
                    <PermissionContext.Provider value={{ permissions: [permission], setPermissions: () => { } }}>
                        <NavigationRibbon
                            tabs={tabs} setTabs={noop}
                            setActiveForm={noop}
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
            const tabs = [startForm, anfForm]
            const activeForm = anfForm
            // Act
            render( 
                <NavigationTabs
                    tabs={tabs} setTabs={noop}
                    activeForm={activeForm} setActiveForm={noop}
            />
            )
            // Assert 
            expect(screen.getByText('Anfragen')).not.toBeNull()
            expect(screen.getByText('Stammdaten')).not.toBeNull()
            expect(document.getElementsByClassName('active')[0].textContent).toBe('Anfragen ')
        })

    })
})