import { render, screen } from '@testing-library/react';
import { expect } from 'expect';
import { FormTab } from '../navigation/ribbon.js';
import { RibbonNavigation } from '../navigation/ribbon.navigation.js';
import { PermissionContext } from '../../utils/permissionContext.js';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

const startPage: FormTab = { name: 'Stammdaten', id: 'stammForm' }

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

describe('Navigation Component Test', (): void => {
    
    describe('Navigation Ribbon Test with permissions"', (): void => {

        // Arrange
        const tabs = [startPage]
        const setTabs = () => { }
        const setActiveForm = () => { }
        const theme = 'light'
        const setTheme = () => { }

        const oidcConfig: AuthProviderProps = {
            authority: 'test',
            client_id: 'test',
            redirect_uri: 'test',
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            scope: "openid profile email admin user",
            extraQueryParams: {
                audience: 'test'
            }
        }

        for (const permission in permissionGroups) {

            it(`displays the ribbon navigation for ${permission}`, async (): Promise<void> => {
                // Act
                render(
                    <AuthProvider {...oidcConfig}>
                        <PermissionContext.Provider value={{ permissions: [permission], setPermissions: () => { } }}>
                            <RibbonNavigation
                                tabs={tabs} setTabs={setTabs}
                                setActiveForm={setActiveForm}
                                theme={theme} setTheme={setTheme}
                            />
                        </PermissionContext.Provider>
                    </AuthProvider >
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
    
})