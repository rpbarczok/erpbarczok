// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { expect } from 'expect';
// import { useState } from 'react';
// import { Form, FormNav, FormTab } from '../components/navigation/ribbon.js';
// import { RibbonNavigation } from '../components/navigation/ribbon.navigation.js';
// import { PermissionContext } from '../utils/permissionContext.js';
// import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
// import { WebStorageStateStore } from 'oidc-client-ts';

// const startPage: FormTab = { name: 'Stammdaten', id: 'stammForm' }

// describe('Navigation Component Test', (): void => {
//     describe('Navigation Ribbon Test', (): void => {


//         it('displays the ribbon navigation', async (): Promise<void> => {
//             // Arrange
//             const tabs = [startPage]
//             const setTabs = () => { }
//             const setActiveForm = () => { }
//             const theme = 'light'
//             const setTheme = () => { }

//             const oidcConfig: AuthProviderProps = {
//                 authority: 'test',
//                 client_id: 'test',
//                 redirect_uri: 'test',
//                 userStore: new WebStorageStateStore({ store: window.localStorage }),
//                 scope: "openid profile email admin user",
//                 extraQueryParams: {
//                     audience: 'test'
//                 }
//             }

//             // Act
//             render(
//                 <AuthProvider { ...oidcConfig }>
//                 <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: () => { } }}>
//                     <RibbonNavigation
//                         tabs={tabs} setTabs={setTabs}
//                         setActiveForm={setActiveForm}
//                         theme={theme} setTheme={setTheme}
//                     />
//                 </PermissionContext.Provider>
//                 </AuthProvider >
//             )
//         // Assert
        
//     })
// })
// })