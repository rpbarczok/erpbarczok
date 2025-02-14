import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { DataWithMeta } from '../../forms.jsx'
import { ListCompanytypes } from './list.comanytypes.jsx'
import { useCompanytypes } from './useCompanytypes.js'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { Notes } from 'components/notifiers/notifiers.jsx'

export interface Companytype {
    "name": string
}

export const blandCompanytype: DataWithMeta<Companytype> = {
    meta: { location: 0, etag: '' },
    data: { name: '' }
}

export const Companytypes = () => {
    const [listCompanytypes, setIsCompanytypeChanged] = useCompanytypes()

    const fullList = listCompanytypes.concat([blandCompanytype])
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()

    return (
        <>
            <Row>
                <h1>Firmenrolle</h1>
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ListGroup className="standardDesign" key="company-list" >
                    <ListCompanytypes
                        fullList={fullList}
                        setIsCompanytypeChanged={setIsCompanytypeChanged}
                        addMainNote={addMainNote} />
                </ListGroup >
            </Row>
        </>
    )
}
