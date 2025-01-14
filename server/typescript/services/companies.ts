import { error_formatter, NotFoundError } from './error.js'
import {Company} from '../models/companies.js'
import { CompanyApi } from '../controllers/companies/index.js'


function update_company(company: CompanyApi) {
    const result: CompanyApi = { name: company.name }
    company.abbr !== undefined ? result.abbr = company.abbr : result.abbr = null
    company.www !== undefined ? result.www = company.www : result.www = null
    return result
}

export const getAllCompanies = () => new Promise<Company[]>(async function (resolve, reject) {
    try {
        const companies = await Company.findAll({ order: [['name', 'ASC']] })
        resolve(companies)
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})
export const addCompany = (body: CompanyApi) => new Promise<number>(async function (resolve, reject) {
    const company: CompanyApi = { name: body.name }
    if (body.abbr) {
        company.abbr = body.abbr
    }
    if (body.www) {
        company.www = body.www
    }
    try {
        const newCompany = await Company.create(company)
        resolve(newCompany.id)
    } catch (err) {
        reject(error_formatter(500, err))
    }
})

export const getCompanyById = (id: number) => new Promise<Company>(async function (resolve, reject) {
    try {
        const company = await Company.findByPk(id)
        if (company === null) {
            reject(new NotFoundError())
        } else {
            resolve(company)
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const deleteCompanyById = (id: number) => new Promise<void>(async (resolve, reject) => {
    try {
        const deletedRowsCount = await Company.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            reject(new NotFoundError)
        } else {
            resolve()
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})
export const putCompanyById = (id: number, body: CompanyApi) => new Promise<void>(async (resolve, reject) => {
    try {
        const company = await Company.findByPk(id)
        if (company === null) {
            reject(new NotFoundError())
        } else {
            await company.update(update_company(body))
            resolve()
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})
