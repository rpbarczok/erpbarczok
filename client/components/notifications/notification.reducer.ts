import { Notification } from "./notifications.js"

interface NotificationAction {
    type: 'addNotification' | 'removeNotification'
    notification: Notification
}

export function notificationReducer(notifications: Notification[], action: NotificationAction) {
    const deleteNotification = (notification: Notification) => {
        return (a: Notification[]) => a.filter(n => n !== notification)
    }
    
    switch (action.type) {
        case 'addNotification': {
            setTimeout(() => deleteNotification(action.notification), 5000)
            return((a: Notification[]) => [
                ...a,
                action.notification
            ]
            )
        }
        case 'removeNotification': {
            deleteNotification(action.notification)
        }
    }
}