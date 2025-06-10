import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.js'
import { Form } from 'react-bootstrap'
import { ResourceDescription } from '../resourceList.js'


export interface Country {
    'name': string
    'abbr': string
    'isEU': boolean
}

export const countryDescription: ResourceDescription<Country> = { name: 'Land', paths: { 'all': '/countries/', 'single': '/countries/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '', abbr: '', isEU: false } } }

interface CountriesInputProps {
    country: DataWithMeta<Country>
    setCountry: React.Dispatch<React.SetStateAction<DataWithMeta<Country>>>
}

export const CountriesInput: FunctionComponent<CountriesInputProps> = ({ country, setCountry }) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCountry({
            meta: country.meta,
            data: {
                name: e.target.value,
                abbr: country.data.abbr,
                isEU: country.data.isEU
            }
        })
    }

    const handleChangeAbbr = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCountry({
            meta: country.meta,
            data: {
                name: country.data.name,
                abbr: e.target.value,
                isEU: country.data.isEU
            }
        })
    }

    const handleChangeEU = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCountry({
            meta: country.meta,
            data: {
                name: country.data.name,
                abbr: country.data.abbr,
                isEU: Boolean(e.target.value)
            }
        })
    }

    return <Form.Group controlId='formCountry'>
        <Form.Label className='labelPadding'>Ländername</Form.Label>
        <Form.Control required type='text' value={country.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte ein Land eintragen.
        </Form.Control.Feedback>
        <Form.Label className='labelPadding'>Länderkürzel</Form.Label>
        <Form.Control required type='text' value={country.data.abbr} onChange={handleChangeAbbr} />
        <Form.Control.Feedback type='invalid'>
            Bitte die Abk lt. ISO 3166-3 (Alpha-3) eintragen. Das ist die mit drei Buchstaben.
        </Form.Control.Feedback>
        <Form.Check type='checkbox' label='Land ist Teil der EU?' onChange={handleChangeEU} />
    </Form.Group>
}
