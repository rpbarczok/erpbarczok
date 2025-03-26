import { Note, Notes } from '../notifiers/notifiers.jsx'
import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'expect'


describe('Notifier Component Test', (): void => {
    it('given a note list with one message, displays the message', async function (): Promise<void> {
        const notes: Note[] = [{ variant: 'success', message: 'Test' }]
        const deleteNote = (note: Note) => {
            return (a: Note[]) => a.filter(n => n !== note)
        }

        render(<Notes notes={notes} removeNote={(note) => deleteNote(notes[0])} />)

        expect(screen.getByText('Test')).not.toBeNull()
    })

})

