import { createNewError } from './error.js'
import { Company } from '../models/companies.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyNorm, CompanyFK } from '../controllers/companies/index.js'

export const getAllCompanies = async () => {
    try {
        const companies = await Company.findAll({ include: CompanyType, order: [['name', 'ASC']] })
        return companies
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const addCompany = async (company: CompanyNorm) => {
    const companyType = await CompanyType.findOne({ where: { name: company.companyType } })
    if (companyType) {
        const newCompany = { name: company.name, companyTypeId: companyType.id, abbr: company.abbr, www: company.www }
        try {
            const addedCompany = await Company.create(newCompany)
            const addedCompanyInclude = await Company.findByPk(addedCompany.id, {include: CompanyType})
            if (addedCompanyInclude) {
                return addedCompanyInclude
            } else {
                return createNewError(500, 'Error when creating company type.')
            }
        } catch (error) {
            return createNewError(500, error.message)
        }
    } else {
        return createNewError(404)
    }
}

export const getCompanyById = async (id: number) => {
    try {
        const company = await Company.findByPk(id, { include: CompanyType })
        if (company === null) {
            return createNewError(404)
        } else {
            return company
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const deleteCompanyById = async (id: number) => {
    try {
        const deletedRowsCount = await Company.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            return createNewError(404)
        } else {
            return 
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const putCompanyById = async (id: number, company: CompanyNorm) => {
    try {
        if (company.name && company.companyType) {
            const oldCompany = await Company.findByPk(id, { include: CompanyType })
            if (oldCompany === null) {
                return createNewError(404)
            } else {
                const companyType = await CompanyType.findOne({ where: { name: company.companyType } })
                if (companyType) {
                    const data: CompanyFK = { name: company.name, companyTypeId: companyType.id }
                    data.abbr = company.abbr || null
                    data.www = company.www || null
                    const updatedRow = await Company.update(data, { returning: true, where: { id: id } })
                    if (updatedRow.length === 2) {
                        const updatedCompany = updatedRow[1]
                        const updatedCompanyInclude = await Company.findByPk(updatedCompany[0].id, {include: CompanyType})
                        if (updatedCompanyInclude) {
                            return updatedCompanyInclude
                        } else {
                             return createNewError(500, 'Error when updating company type')
                        }
                    } else {
                         return createNewError(500, 'Error when updating company type')
                    }
                } else {
                    return createNewError(404)
                }
            }
        } else {
            return createNewError(400)
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}
