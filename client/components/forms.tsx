import Companies from "./companies/companies.jsx"
import Admin from "./admin/admin.jsx"
import { FormTab } from "./navigation/ribbon.jsx"
import '../style.css'
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useEffect, useState } from "react"
import { client } from "utils/openapiclientaxios.js"
import { Companytype } from "./companies/companies.jsx"

interface Meta {
    location: number
    etag: string
}
export interface DataWithMeta<T> {
    "meta": Meta
    "data": T
}

const Forms = ({ activeForm }: { activeForm: FormTab }) => {
    const [listCompanytypes, setListCompanytypes] = useState<DataWithMeta<Companytype>[]>([])
    const [isCompanytypeChanged, setIsCompanytypeChanged] = useState<boolean>(true)
    useEffect(() => {
        {
            if (isCompanytypeChanged) {
                client.getCompanytypes()
                    .then(result => {
                        client.getCompanytypes()
                            .then(result => {
                                const newList = result?.data.map(row => {
                                    const newRow: DataWithMeta<Companytype> = {
                                        meta: {
                                            location: Number(removeBeforeLastDigits(row.meta.location)),
                                            etag: row.meta.etag
                                        },
                                        data: row.data
                                    }
                                    return (newRow)
                                })
                                setListCompanytypes(newList)
                                setIsCompanytypeChanged(false)
                            })
                    })
            }

        }
    }, [isCompanytypeChanged])

    switch (activeForm.id) {
        case 'stammForm':
            return <Companies
                listCompanytypes={listCompanytypes}
            />
        case 'adminForm':
            return <Admin
                listCompanytypes={listCompanytypes} setIsCompanytypeChanged={setIsCompanytypeChanged}
            />
        default:
            return <h1> {activeForm.name}: Work in Progress</h1>
    }
}

export default Forms