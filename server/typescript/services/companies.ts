import { error_formatter, NotFoundError } from './error.js'
import { Company } from '../models/companies.js'
import { Companytype } from '../models/companytypes.js'
import { CompanyResponse, CompanyCreate } from '../controllers/companies/index.js'

export const getAllCompanies = () => new Promise<Company[]>(async function (resolve, reject) {
    try {
        const companies = await Company.findAll({ include: Companytype, order: [['name', 'ASC']] })
        resolve(companies)
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const addCompany = (body: CompanyResponse) => new Promise<Company>(async function (resolve, reject) {
    const companytype = await Companytype.findOne({ where: { name: body.companytype } })
    if (companytype) {
        const company: CompanyCreate = { name: body.name, CompanytypeId: companytype.id }
        if (body.abbr) company.abbr = body.abbr
        if (body.www) company.www = body.www
        try {
            const newCompany = await Company.create(company)
            const newCompanyInclude = await Company.findByPk(newCompany.id, {include: Companytype})
            if (newCompanyInclude) {
                resolve(newCompanyInclude)
            } else {
                reject(error_formatter(500, 'Unexpected inernal error'))
            }
        } catch (err) {
            reject(error_formatter(500, err))
        }
    } else {
        reject(new NotFoundError())
    }
})

export const getCompanyById = (id: number) => new Promise<Company>(async function (resolve, reject) {
    try {
        const company = await Company.findByPk(id, { include: Companytype })
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
export const putCompanyById = (id: number, body: CompanyResponse) => new Promise<Company>(async (resolve, reject) => {
    try {
        if (body.name && body.companytype) {
            const company = await Company.findByPk(id, { include: Companytype })
            if (company === null) {
                reject(new NotFoundError())
            } else {
                const companytype = await Companytype.findOne({ where: { name: body.companytype } })
                if (companytype) {
                    const data: CompanyCreate = { name: body.name, CompanytypeId: companytype.id }
                    body.abbr ? data.abbr = body.abbr : data.abbr = null
                    body.www ? data.www = body.www : data.www = null
                    const updatedRow = await Company.update(data, { returning: true, where: { id: id } })
                    if (updatedRow.length === 2) {
                        const updatedCompany = updatedRow[1]
                        const updatedCompanyInclude = await Company.findByPk(updatedCompany[0].id, {include: Companytype})
                        if (updatedCompanyInclude) {
                            resolve(updatedCompanyInclude)
                        } else {
                            reject(error_formatter(500, 'Unexpected internal error'))
                        }
                    } else {
                        reject(error_formatter(500, 'Unexpected internal error'))
                    }
                } else {
                    reject(new NotFoundError())
                }
            }
        } else {
            reject(error_formatter(400, "Bad request"))
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})
