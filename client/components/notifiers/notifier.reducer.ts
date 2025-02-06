import { Note } from "./notifiers.jsx"

interface NotifierAction {
    type: 'addNote' | 'removeNote'
    note: Note
}

export function notifierReducer(notes: Note[], action: NotifierAction) {
    const deleteNote = (note: Note) => {
        return (a: Note[]) => a.filter(n => n !== note)
    }
    
    switch (action.type) {
        case 'addNote': {
            setTimeout(() => deleteNote(action.note), 5000)
            return((a: Note[]) => [
                ...a,
                action.note
            ]
            )
        }
        case 'removeNote': {
            deleteNote(action.note)
        }
    }
}