import { useState, useCallback } from "react"
import { Notification } from "./notifications.jsx"

export function useNotification(): [Notification[], (notification: Notification) => void, (notification: Notification) => void] {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const removeNotification = useCallback((notification: Notification) => {
        setNotifications(a => a.filter(n => n !== notification))
    }, [setNotifications])

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(a => [
            ...a,
            notification
        ]
        )
        setTimeout(() => removeNotification(notification), 5000)
    }, [setNotifications])

    return [notifications, addNotification, removeNotification]
}


