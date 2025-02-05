import { useState, useCallback } from "react"
import { Notifier } from "./notifiers.jsx"

export function useNotifier(): [Notifier[], (notifier: Notifier) => void, (notifier: Notifier) => void] {
    const [notifiers, setNotifiers] = useState<Notifier[]>([])

    const removeNotifier = useCallback((notifier: Notifier) => {
        setNotifiers(a => a.filter(n => n !== notifier))
    }, [setNotifiers])

    const addNotifier = useCallback((notifier: Notifier) => {
        setNotifiers(a => [
            ...a,
            notifier
        ]
        )
        setTimeout(() => removeNotifier(notifier), 10000)
    }, [setNotifiers])

    return [notifiers, addNotifier, removeNotifier]
}


