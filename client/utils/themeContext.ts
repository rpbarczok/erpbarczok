import { createContext } from 'react'

export const ThemeContext = createContext(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')