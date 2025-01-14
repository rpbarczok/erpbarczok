import { ChangeEvent } from "react"
import "../../style.css"
import {Form} from 'react-bootstrap'


export default function SearchCompanies(props) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        props.setSearch(e.target.value)
    }

    return (
        <Form >
            <Form.Label className="smallDesign">Suche (Firmenname, Kürzel)</Form.Label>
            <Form.Control type="text" className="smallDesign" value={props.search} onChange={handleSearch} />
        </Form>
    ) 
} 
