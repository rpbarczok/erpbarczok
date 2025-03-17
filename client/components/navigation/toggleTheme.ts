import React from "react"

export const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>, theme: "light" | "dark", setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>) => {
    e.preventDefault
    if (theme === 'light') {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'dark')
        setTheme('dark')
    } else {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'light')
        setTheme('light')
    }
  }