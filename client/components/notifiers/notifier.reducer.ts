import { Notifier } from "./notifiers.jsx"

interface NotifierAction {
    type: 'addNotifier' | 'removeNotifier'
    notifier: Notifier
}

export function notifierReducer(notifiers: Notifier[], action: NotifierAction) {
    const deleteNotifier = (notifier: Notifier) => {
        return (a: Notifier[]) => a.filter(n => n !== notifier)
    }
    
    switch (action.type) {
        case 'addNotifier': {
            setTimeout(() => deleteNotifier(action.notifier), 5000)
            return((a: Notifier[]) => [
                ...a,
                action.notifier
            ]
            )
        }
        case 'removeNotifier': {
            deleteNotifier(action.notifier)
        }
    }
}