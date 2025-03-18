import React from "react"

export type Theme = "light" | "dark"

export const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>, theme: Theme, setTheme: React.Dispatch<React.SetStateAction<Theme>>) => {
    e.preventDefault
    if (theme === 'light') {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'dark')
        setTheme('dark')
    } else {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'light')
        setTheme('light')
    }
  }