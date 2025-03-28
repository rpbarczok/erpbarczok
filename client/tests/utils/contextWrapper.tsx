import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeContext } from 'utils/themeContext.js';
import { LoadingContext } from 'utils/loadingContext.js';

const theme = 'light'
const noob = () => { }
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

const AllTheProviders = ({ children }: { children: React.ReactNode, permission: string }) => {
    return (
        <AuthProvider {...oidcConfig}>
            <ThemeContext.Provider value={theme}>
                <LoadingContext.Provider value={{ isLoading: false, setIsLoading: noob }}>
                    {children}
                </LoadingContext.Provider>
            </ThemeContext.Provider>
        </AuthProvider>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }