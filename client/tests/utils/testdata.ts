import { Company } from "../../components/companies/CompanyFormBasis.js"
import { DataWithMeta } from "../../components/forms.jsx"

// eslint-disable-next-line
export const noop = () => { }

// eslint-disable-next-line
export const asyncNoop = async () => {}

export const companyTestTypesList = [
    { meta: { etag: 'abc', location: 1 }, data: { name: 'Kunde' } },
    { meta: { etag: 'dce', location: 2 }, data: { name: 'Spediteur' } },
    { meta: { etag: 'afg', location: 3 }, data: { name: 'Lieferant' } },
    { meta: { etag: 'asg', location: 4 }, data: { name: 'Sonstiges' } },
]

export const emptyList = []

export const companyTestList: DataWithMeta<Company>[] = [
    { meta: { etag: 'abc', location: 5 }, data: { name: 'Firma A', companyType: 'Kunde', abbr: 'FRA', www: 'www.aaa.com'} },
    { meta: { etag: 'dce', location: 6 }, data: { name: 'Firma B', companyType: 'Spediteur', abbr: 'FRB', www: 'www.bbb.com'} },
    { meta: { etag: 'afg', location: 7 }, data: { name: 'Firma C', companyType: 'Lieferant', abbr: 'FRC'} },
    { meta: { etag: 'asg', location: 8 }, data: { name: 'Firma D', companyType: 'Sonstiges'} },
]