import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { DataWithMeta } from '../../forms.jsx'
import { ListCompanyTypes } from './list.companyTypes.jsx'
import { useCompanyTypes } from './useCompanyTypes.js'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { Notes } from 'components/notifiers/notifiers.jsx'

export interface CompanyType {
    "name": string
}

export const blandCompanyType: DataWithMeta<CompanyType> = {
    meta: { location: 0, etag: '' },
    data: { name: '' }
}

export const CompanyTypes = () => {
    const [listCompanyTypes, setIsCompanyTypeChanged] = useCompanyTypes()

    const fullList = listCompanyTypes.concat([blandCompanyType])
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()

    return (
        <>
            <Row>
                <h1>Firmenrolle</h1>
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ListGroup className="standardDesign" key="company-list" >
                    <ListCompanyTypes
                        fullList={fullList}
                        setIsCompanyTypeChanged={setIsCompanyTypeChanged}
                        addMainNote={addMainNote} />
                </ListGroup >
            </Row>
        </>
    )
}
