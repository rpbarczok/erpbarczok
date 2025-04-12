export type Theme = 'light' | 'dark'

export const toggleTheme = (theme: Theme, setTheme: React.Dispatch<React.SetStateAction<Theme>>) => {
    if (theme === 'light') {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'dark')
        setTheme('dark')
    } else {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'light')
        setTheme('light')
    }
  }