import { Alert } from "react-bootstrap"

type labelNotifier = 'mainCompanies' | 'addCompanies' | 'mainCompanytypes' | 'addCompanytypes' 

export interface Notifier {
    variant: 'success' | 'info' | 'danger' | 'warning'
    message: string
    label: labelNotifier
}

interface NotifiersComponent {
    notifiers: Notifier[]
    removeNotifier: Function
    label: labelNotifier
}

export const Notifiers = ({ notifiers, removeNotifier, label }: NotifiersComponent) => {

    const handleClose = (e: CloseEvent, note: Notifier) => {
        removeNotifier(note)
    }

    const filter = notifiers.filter(note => note.label === label)

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