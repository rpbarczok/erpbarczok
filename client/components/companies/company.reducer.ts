import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { ChangeCompanyAction } from "./companies.js"

export function changeCompanyReducer(changeCompany: DataWithMeta<Company>, action: ChangeCompanyAction): DataWithMeta<Company> {
    if (typeof action.newValue === 'string') {
        switch (action.type) {
            case 'nameChange': {
                return {
                    meta: changeCompany.meta,
                    data: {
                        ...changeCompany.data,
                        "name": action.newValue,
                    }
                }
            }
            case 'abbrChange': {
                return (
                    {
                        meta: changeCompany.meta,
                        data: {
                            ...changeCompany.data,
                            "abbr": action.newValue,
                        }
                    })
            }
            case 'wwwChange': {
                return (
                    {
                        meta: changeCompany.meta,
                        data: {
                            ...changeCompany.data,
                            "www": action.newValue,
                        }
                    })
            }
            case 'companytypeChange': {
                return ({
                    meta: changeCompany.meta,
                    data: {
                        ...changeCompany.data,
                        "companytype": action.newValue,
                    }
                })
            }
        }
    } else {
        if (action.type === 'companyChange') {
            return (
                action.newValue
            )
        }
    }
    throw Error('Unknwon action: ' + action.type)
}