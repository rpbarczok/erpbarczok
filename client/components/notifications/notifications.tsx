import { Alert } from "react-bootstrap"
import React, { useEffect, useState } from "react"

export interface Notification {
    variant: 'success' | 'info' | 'danger' | 'warning'
    message: string
    label: 'mainCompanies' | 'addCompanies'
}

interface NotificationsComponent {
    notifications: Notification[]
    removeNotification: Function
    label: 'mainCompanies' | 'addCompanies'
}

export const Notifications = ({ notifications, removeNotification, label }: NotificationsComponent) => {

    const handleClose = (e: CloseEvent, note: Notification) => {
        removeNotification(note)
    }

    const filter = notifications.filter(note => note.label === label)

    let i = 0
    const result = filter.map(note => {
        i += 1
        return (
            <Alert key={i} variant={note.variant} onClose={(e) => handleClose(e, note)} dismissible>{note.message}</Alert>
        )
    }
    )
    return result
}