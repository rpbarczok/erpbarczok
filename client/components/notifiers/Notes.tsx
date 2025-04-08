import { Alert } from 'react-bootstrap'

export interface Note {
    variant: 'success' | 'info' | 'danger' | 'warning'
    message: string
}

interface NotesComponent {
    notes: Note[]
    removeNote: (note: Note) => void
}

export const Notes = ({ notes, removeNote }: NotesComponent) => {

    const handleClose = (note: Note) => {
        removeNote(note)
    }

    let i = 0
    return notes.map(note => {
        i += 1
        return (
            <Alert key={i} variant={note.variant} onClose={() => handleClose(note)} dismissible>{note.message}</Alert>
        )
    }
    )
}