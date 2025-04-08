import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const startTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
export const ThemeContext = createContext(startTheme)