import { ChangeEvent, FunctionComponent } from 'react'
import { Form} from 'react-bootstrap'

interface CompanySMSearchProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const CompanySMSearch: FunctionComponent<CompanySMSearchProps> = ({ search, setSearch }) => {

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
