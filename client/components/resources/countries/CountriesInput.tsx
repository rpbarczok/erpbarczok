import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.js'
import { Form } from 'react-bootstrap'
import { GenericResource, isResourceDescription, Resource, ResourceDescription } from '../resourceList.js'

export interface Country extends GenericResource {
    name: string
    abbr: string
    isEU: boolean
}

export interface CountryDescription extends ResourceDescription<Resource>{
    name: 'Land'
    paths: {
        'all': '/countries/'
        'single': '/countries/{id}'
    }
    empty: DataWithMeta<Country>
}

export function isCountryDescription(obj: unknown): obj is CountryDescription {
    if (isResourceDescription(obj)){
        if (obj.name === 'Land') return true
    } 
    return false
}

export const countryDescription: CountryDescription = { name: 'Land', paths: { 'all': '/countries/', 'single': '/countries/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '', abbr: '', isEU: false } }}

export interface CountryPayloadAndDescription {
    description: CountryDescription
    item: DataWithMeta<Country>
}

export function isCountry(obj: unknown): obj is Country {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    if (Object.keys(obj).length === 3) {
        if (Object.keys(obj).includes('name') && (Object.keys(obj).includes('abbr')) && (Object.keys(obj).includes('isEU'))) {
            return true
        }
    }
    return false
}


interface CountriesInputProps {
    country: CountryPayloadAndDescription
    setCountry: React.Dispatch<React.SetStateAction<CountryPayloadAndDescription>>
}

export const CountriesInput: FunctionComponent<CountriesInputProps> = ({ country, setCountry }) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCountry({
            ...country,
            item: {
                ...country.item,
                data: {
                    ...country.item.data,
                    name: e.target.value
                }
            }
        })
    }

    const handleChangeAbbr = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCountry({
            ...country,
            item: {
                ...country.item,
                data: {
                    ...country.item.data,
                    abbr: e.target.value
                }
            }
        })
    }

    const handleChangeEU = (e: ChangeEvent<HTMLInputElement>) => {
        setCountry({
            ...country,
            item: {
                ...country.item,
                data: {
                    ...country.item.data,
                    isEU: e.target.checked
                }
            }
        })
    }

    return <Form.Group controlId='formCountry'>
        <Form.Label className='labelPadding'>Ländername</Form.Label>
        <Form.Control required type='text' value={country.item.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte ein Land eintragen.
        </Form.Control.Feedback>
        <Form.Label className='labelPadding'>Länderkürzel</Form.Label>
        <Form.Control required type='text' value={country.item.data.abbr} onChange={handleChangeAbbr} />
        <Form.Control.Feedback type='invalid' >
            Bitte die Abk lt. ISO 3166-3 (Alpha-3) eintragen. Das ist die mit drei Buchstaben.
        </Form.Control.Feedback>
        <Form.Check type='checkbox' label='Land ist Teil der EU?' checked={country.item.data.isEU} onChange={handleChangeEU} />
    </Form.Group>
}
