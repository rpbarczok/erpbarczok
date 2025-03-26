import { error_formatter, NotFoundError } from './error.js'
import { Company } from '../models/companies.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyNorm, CompanyFK } from '../controllers/companies/index.js'

export const getAllCompanies = () => new Promise<Company[]>(async function (resolve, reject) {
    try {
        const companies = await Company.findAll({ include: CompanyType, order: [['name', 'ASC']] })
        resolve(companies)
    }
    catch (error) {
        reject(error_formatter(500, error))
    }
})

export const addCompany = (company: CompanyNorm) => new Promise<Company>(async function (resolve, reject) {
    const companyType = await CompanyType.findOne({ where: { name: company.companyType } })
    if (companyType) {
        const newCompany = { name: company.name, companyTypeId: companyType.id, abbr: company.abbr, www: company.www }
        try {
            const addedCompany = await Company.create(newCompany)
            const addedCompanyInclude = await Company.findByPk(addedCompany.id, {include: CompanyType})
            if (addedCompanyInclude) {
                resolve(addedCompanyInclude)
            } else {
                reject(error_formatter(500, 'Unexpected inernal error'))
            }
        } catch (error) {
            reject(error_formatter(500, error))
        }
    } else {
        reject(new NotFoundError())
    }
})

export const getCompanyById = (id: number) => new Promise<Company>(async function (resolve, reject) {
    try {
        const company = await Company.findByPk(id, { include: CompanyType })
        if (company === null) {
            reject(new NotFoundError())
        } else {
            resolve(company)
        }
    }
    catch (error) {
        reject(error_formatter(500, error))
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
    catch (error) {
        reject(error_formatter(500, error))
    }
})
export const putCompanyById = (id: number, company: CompanyNorm) => new Promise<Company>(async (resolve, reject) => {
    try {
        if (company.name && company.companyType) {
            const oldCompany = await Company.findByPk(id, { include: CompanyType })
            if (oldCompany === null) {
                reject(new NotFoundError())
            } else {
                const companyType = await CompanyType.findOne({ where: { name: company.companyType } })
                if (companyType) {
                    const data: CompanyFK = { name: company.name, companyTypeId: companyType.id }
                    company.abbr ? data.abbr = company.abbr : data.abbr = null
                    company.www ? data.www = company.www : data.www = null
                    const updatedRow = await Company.update(data, { returning: true, where: { id: id } })
                    if (updatedRow.length === 2) {
                        const updatedCompany = updatedRow[1]
                        const updatedCompanyInclude = await Company.findByPk(updatedCompany[0].id, {include: CompanyType})
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
            reject(error_formatter(400, 'Bad request'))
        }
    }
    catch (error) {
        reject(error_formatter(500, error))
    }
})
