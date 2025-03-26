import React, { createContext } from 'react'

export interface LoadingContextInterface {
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingContextInterface | undefined>(undefined)