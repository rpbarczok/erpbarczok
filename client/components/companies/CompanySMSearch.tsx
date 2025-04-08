import { ChangeEvent } from 'react'
import { Form} from 'react-bootstrap'

interface CompanySMSearchInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function CompanySMSearch({ search, setSearch }: CompanySMSearchInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <>
            <Form.Group controlId='searchField' className='d-none d-sm-block'  style={{padding:'10px 0 0 0'}}>
                <Form.Label className= 'labelPadding' >Suche (Firma, Kürzel)</Form.Label>
                <Form.Control type='text'  value={search} onChange={handleSearch} />
            </Form.Group>
        </>
    )
}
