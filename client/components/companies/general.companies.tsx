import {Col, Row} from 'react-bootstrap'
import "../../style.css"
import ListCompanies from './list.companies.js' 
import AddCompanies from './add.companies.js'
import SearchCompanies from './search.companies.js'
import {useState} from 'react' 

export default function GeneralCompanies(props) {
 
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
     
    return (
        <Row className="suche">
            <Col>
                <SearchCompanies search={search} setSearch={setSearch} onChangeActive={props.onChangeActive}/> 
            </Col>
            <Col>
                <ListCompanies 
                    isChanged={props.isChanged} setIsChanged={props.setIsChanged} 
                    search={search} 
                    active ={props.active} onChangeActive={props.onChangeActive}  
                    isNew= {isNew} setIsNew={setIsNew}
                    listCompanies = {props.listCompanies} setListCompanies = {props.ListCompanies}
                /> 
            </Col>
            <Col>
                <AddCompanies 
                    setIsChanged={props.setIsChanged} 
                    onChangeActive={props.onChangeActive}
                    setIsNew= {setIsNew}
                    setAlert = {props.setAlert}
                />
            </Col>
            <Col>
            </Col>
        </Row>
    )
}  