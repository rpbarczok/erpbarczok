import { AlertNote } from "components/companies/companies.jsx"
import { Alert } from "react-bootstrap"
import React, { useEffect, useState } from "react"

interface AlertNotesComponent {
    alertNotes: AlertNote[]
    setAlertNotes: React.Dispatch<React.SetStateAction<AlertNote[]>>
}

export const AlertNotes = ({ alertNotes, setAlertNotes}: AlertNotesComponent) => {
    let i = 0
    const result = alertNotes.map(note => {
        i += 1
        return (
            <Alert key={i} variant={note.variant} onClose={() => setAlertNotes(a => a.filter(n => n !== note))} dismissible>{note.message}</Alert>
        )
    }
    )
    return result
}