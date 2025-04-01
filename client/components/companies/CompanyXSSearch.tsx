import { ChangeEvent } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

interface CompanyXSSearchInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function CompanyXSSearch({ search, setSearch }: CompanyXSSearchInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <>
            <InputGroup style={{ padding: '10px 0 0 0' }} >
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control type='text' className='standardDesign' value={search} onChange={handleSearch} placeholder='Suche (Firma, Kürzel)' />
            </InputGroup>
        </>
    )
}
