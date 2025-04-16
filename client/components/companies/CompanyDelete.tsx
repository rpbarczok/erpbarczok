import { Button } from 'react-bootstrap'
import { Note } from '../notifiers/Notes.jsx'
import { FunctionComponent } from 'react'

interface CompanyDeleteProps {
    addNote: (note: Note) => void
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    size?: 'sm' | 'lg'
    deleteCompany: () => Promise<Note | undefined>
}

export const CompanyDelete: FunctionComponent<CompanyDeleteProps> = ({ addNote, setShow, size, deleteCompany }) => {

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const newNote: Note | undefined = await deleteCompany()

        if (newNote) {
            if (newNote.variant === "warning") {
                addNote(newNote)
                if (setShow) {
                    setShow(false)
                }
            } else {
                addNote(newNote)
            }
        }
    }



    return <Button size={size} variant='outline-danger' onClick={handleDelete}>Löschen</Button>
}
