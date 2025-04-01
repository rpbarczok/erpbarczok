import { Company } from '../CompanyFormBasis.jsx';
import { DataWithMeta } from '../../../components/forms.jsx';


export const filterList = (list: DataWithMeta<Company>[], search: string) => {
    if (search) {
        return list.filter((company: DataWithMeta<Company>) => {
            if (company.data.abbr) {
                if (company.data.abbr) {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase()) || company.data.abbr.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                }           
            }
        })
    } else {
        return list
    }
}

