import { useState, useCallback } from "react"
import { Note } from "./notifiers.jsx"

export function useNotifier(): [Note[], (note: Note) => void, (note: Note) => void] {
    const [notes, setNotes] = useState<Note[]>([])

    const removeNote = useCallback((note: Note) => {
        setNotes(a => a.filter(n => n !== note))
    }, [setNotes])

    const addNote = useCallback((note: Note) => {
        setNotes(a => [
            ...a,
            note
        ]
        )
        setTimeout(() => removeNote(note), 5_000)
    }, [setNotes])

    return [notes, addNote, removeNote]
}


