/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


import { Button } from 'react-bootstrap'
import { changedCompanyReducer } from './utils/changedCompanyReducer.js'
import { Company, emptyCompany } from './CompanyPage.js'
import { DataWithMeta } from '../Pages.jsx'
import { Note } from '../notifiers/Notes.jsx'
import { FunctionComponent, useReducer, useState } from 'react'
import { AddCompanyModal } from './CompanyAddModal.js'
import { GenericResource } from 'components/resources/resourceList.js'

interface CompanyAddProps {
    addEditNote: (note: Note) => void
    companyTypesList: DataWithMeta<GenericResource>[]
    submitNewCompany:(newCompany: DataWithMeta<Company>) => Promise<Note>
}

export const CompanyAdd: FunctionComponent<CompanyAddProps> = ({ addEditNote, companyTypesList, submitNewCompany }) => {

    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [newCompanyClick, setNewCompanyClick] = useState(0)
    const [show, setShow] = useState(false)

    const handleShow = (e: React.MouseEvent) => {
        e.preventDefault()
        setNewCompanyClick(newCompanyClick - 1)
        setShow(true)
    }

    return (
        <>
            <Button variant='outline-primary' onClick={handleShow}>Hinzufügen</Button>
            <AddCompanyModal
                changedCompany={changedCompany}
                addEditNote={addEditNote}
                show={show}
                setShow={setShow}
                newCompanyClick={newCompanyClick}
                changedCompanyDispatch={changedCompanyDispatch}
                companyTypesList={companyTypesList}
                submitNewCompany={submitNewCompany}
            />
        </>
    )
}