/*
Copyright (c) 2025 Ralph Barczok
Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { Company } from '../CompanyPageBasis.js'
import { DataWithMeta } from '../../Pages.js'
import { ListGroup } from 'react-bootstrap'
import { FunctionComponent } from 'react'


interface CompaniesSMListProps {
    filteredCompaniesList: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => Promise<void>
}

export const CompaniesSMList: FunctionComponent<CompaniesSMListProps> = (
    { filteredCompaniesList, 
        activeCompany, 
        changeActive }) => {

    const list = () => {
        if (filteredCompaniesList.length === 0) {
            return (
                <p>Keine Unternehmen gefunden!</p>
            )
        } else {
            return filteredCompaniesList.map((element) => {
                return (
                    <ListGroup.Item  key={element.meta.location} active={element.meta.location === activeCompany.meta.location} onClick={() => changeActive(element.meta.location)} >
                        {element.data.name + (element.data.abbr ? ' (' + element.data.abbr + ')' : '')}
                    </ListGroup.Item>
                )

            }
            )
        }
    }

    return (
        <ListGroup className='scrollBox d-none d-sm-block' style={{ marginTop: '10px' }} id='company-list' >
            {list()}
        </ListGroup >)
        }