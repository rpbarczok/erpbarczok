import { CompanyType } from "components/resources/companyTypes/CompanyTypesInput.js"
import { Company } from "../../components/companies/CompanyPageBasis.js"
import { DataWithMeta, Meta } from "../../components/Pages.js"

// eslint-disable-next-line
export const noop = () => { }

// eslint-disable-next-line
export const asyncNoop = async () => { }

const defaultCompanyType: CompanyType = {
    name: "Kunde"
}

const defaultMeta: Meta = {
    etag: 'abc', location: 1
}

const defaultCompany: Company = {
    name: 'Firma A', companyType: 'Kunde'
}

export const createCompany = (overwrites: Partial<Company> = {}) => ({ ...defaultCompany, ...overwrites })

export const createMeta = (overwrites: Partial<Meta> = {}) => ({ ...defaultMeta, ...overwrites })

export const createCompanyType = (overwrites: Partial<CompanyType> = {}) => ({ ...defaultCompanyType, ...overwrites })

export const metaFactory = (quantity: number): Meta[] => {
    const metaList: Meta[] = []
    for (let i = 1; i<=quantity; i++) {
        metaList.push(createMeta({location: i}))
    }
    return metaList

}

export const companyFactory = (quantity:number): Company[] => {
    const companyList: Company[] = []
    for (let i = 1; i<=quantity; i++) {
        companyList.push(createCompany({name: `Company${String(i)}`, abbr: `CO${String(i)}`, www: `www.company${String(i)}.com`}))
    }
    return companyList
}

export const createCompanyList = (quantity:number): DataWithMeta<Company>[] => {
    const companyListWithMeta: DataWithMeta<Company>[] = []
    for (let i = 1; i<=quantity; i++) {
        const meta: Meta = createMeta({location: i})
        const data: Company =  createCompany({name: `Company${String(i)}`, abbr: `CO${String(i)}`, www: `www.company${String(i)}.com`})
        companyListWithMeta.push({meta: meta, data: data})
    }
    return companyListWithMeta
}

export const companyTypesTestList: DataWithMeta<CompanyType>[] = [
    { meta: createMeta(), data: createCompanyType() },
    { meta: createMeta({location: 2 }), data: { name: 'Spediteur' } },
    { meta: createMeta({location: 3 }), data: { name: 'Lieferant' } },
    { meta: createMeta({location: 4 }), data: { name: 'Sonstiges' } },
]

export const emptyList = []
