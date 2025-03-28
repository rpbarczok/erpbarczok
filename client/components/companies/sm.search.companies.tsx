import { Form} from 'react-bootstrap'
import { ChangeEvent } from 'react'

interface SearchCompaniesInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function SMSearchCompanies({ search, setSearch }: SearchCompaniesInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <>
            <Form.Group controlId='searchField' className='d-none d-sm-block'  style={{padding:'10px 0 0 0'}}>
                <Form.Label className='standardDesign'>Suche (Firma, Kürzel)</Form.Label>
                <Form.Control type='text' className='standardDesign' value={search} onChange={handleSearch} />
            </Form.Group>
        </>
    )
}
