import React, { useEffect, useState } from "react"
import { client } from "utils/openapiclientaxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "./companytypes.jsx"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useAuth } from "react-oidc-context"

export function useCompanytypes(): [DataWithMeta<Companytype>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [listCompanytypes, setListCompanytypes] = useState<DataWithMeta<Companytype>[]>([])
    const [isCompanytypeChanged, setIsCompanytypeChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token


    useEffect(() => {
        if (isCompanytypeChanged) {
            client.getCompanytypes(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
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
            setIsCompanytypeChanged(false)
        }
    }, [isCompanytypeChanged])

    return [listCompanytypes, setIsCompanytypeChanged]
}