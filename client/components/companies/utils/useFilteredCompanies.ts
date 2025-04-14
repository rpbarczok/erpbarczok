import React, { useEffect, useState } from "react"
import { Company } from "../CompanyPageBasis.js"
import { DataWithMeta } from "components/Pages.js"

export function useFilteredCompanyList( 
    search: string, 
    companiesList: DataWithMeta<Company>[], 
    activeCompany: DataWithMeta<Company>, 
    changeActive : (active?: number) => Promise<void>)
    : [DataWithMeta<Company>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [filteredCompaniesList, setFilteredCompaniesList] = useState(companiesList)
    const [isNew, setIsNew] = useState<boolean>(false) // Flag: triggers an clearance of the search input

    useEffect(() => {
        const newList: DataWithMeta<Company>[] = companiesList.filter((company: DataWithMeta<Company>) => {
            if (!isNew) {
                if (company.data.abbr) {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase()) || company.data.abbr.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                }
            } else {
                return company
            }
        })

        const changeActiveAsync = async () => {
            if (newList.length === 0) {
                await changeActive(0)
            } else {
                if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                    await changeActive(newList[0].meta.location)
                }
            }
        }

        void changeActiveAsync()

        setFilteredCompaniesList(newList)
        setIsNew(false)
    }, [search, companiesList])

    return [filteredCompaniesList, setIsNew]
}
