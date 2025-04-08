import { Note, Notes } from '../components/notifiers/Notes.jsx'
import { expect } from 'expect'
import { render, screen } from '@testing-library/react'

describe('Notifier Component Test', function()  {
    it('given a note list with one message, displays the message', function()  {
        const notes: Note[] = [{ variant: 'success', message: 'Test' }]
        const deleteNote = (note: Note) => {
            return (a: Note[]) => a.filter(n => n !== note)
        }

        render(<Notes notes={notes} removeNote={() => deleteNote(notes[0])} />)

        expect(screen.getByText('Test')).not.toBeNull()
    })

})

