import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { DataWithMeta } from '../../forms.jsx'
import { ListFields } from './list.fields.jsx'
import { useFields } from './useFields.js'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { Notes } from 'components/notifiers/notifiers.jsx'

export interface Field {
    "name": string
}

export const blandField: DataWithMeta<Field> = {
    meta: { location: 0, etag: '' },
    data: { name: '' }
}

export const Fields = () => {
    const [listFields, setIsFieldChanged] = useFields()

    const fullList = listFields.concat([blandField])
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()

    return (
        <>
            <Row>
                <h1>Firmenbranche</h1>
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ListGroup className="standardDesign" key="field-list" >
                    <ListFields
                        fullList={fullList}
                        setIsFieldChanged={setIsFieldChanged}
                        addMainNote={addMainNote} />
                </ListGroup >
            </Row>
        </>
    )
}
