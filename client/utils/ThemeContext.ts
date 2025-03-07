import { createContext } from "react";

export type Theme = 'light' | 'dark'
    
const condition = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

let theme = 'light'
if (condition === 'dark') {
    theme = 'dark'
} 

export const ThemeContext = createContext(theme)