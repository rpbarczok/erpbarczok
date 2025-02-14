import '../../style.css'
import './admin.css'
import {ressourceList} from './ressourcelist.jsx'
import {Button} from 'react-bootstrap'
import { Ressource } from './admin.jsx'

interface LeftNavigationInterface {
    setRessource: React.Dispatch<React.SetStateAction<Ressource>>
}

export const LeftNavigation = ({setRessource}: LeftNavigationInterface) => {
    
    const ressourceHandler = (e: React.MouseEvent<HTMLButtonElement>, ressource: Ressource) => {
        e.preventDefault()
        setRessource(ressource)
    }

    const result = ressourceList.map(ressource => {
        return (
            <Button id={ressource.name} key={ressource.name} onClick={(e) => ressourceHandler (e, ressource) }>
                {ressource.name}
            </Button>
        )
    })
    return result
}