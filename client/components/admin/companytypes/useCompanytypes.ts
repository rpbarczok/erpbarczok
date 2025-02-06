import React, { useEffect, useState } from "react"
import { client } from "utils/openapiclientaxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "./companytypes.jsx"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"

export function useCompanytypes(): [DataWithMeta<Companytype>[], React.Dispatch<React.SetStateAction<boolean>>] {
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
                            })
                    })
                    setIsCompanytypeChanged(false)
            }

        }
    }, [isCompanytypeChanged])
    
    return [listCompanytypes, setIsCompanytypeChanged]
}