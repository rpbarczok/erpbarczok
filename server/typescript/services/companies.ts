/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { createNewError } from './error.js'
import { Company } from '../models/companies.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyNorm, CompanyFK } from '../controllers/companies/index.js'
import { baseLogger } from '../logger.js'

export const getAllCompanies = async () => {
    const logger = baseLogger.extend('getAllCompanies')
    try {
        const companies = await Company.findAll({ include: CompanyType, order: [['name', 'ASC']] })
        logger(companies)
        return companies
    }
    catch (error) {
        logger(error)
        return createNewError(500, error)
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
            return createNewError(500, error)
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
        return createNewError(500, error)
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
        return createNewError(500, error)
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
                    data.abbr = company.abbr ?? null
                    data.www = company.www ?? null
                    
                    const updatedRow = await Company.update(data, { returning: true, where: { id: id } })            
                    if (updatedRow[0] === 1) {
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
        return createNewError(500, error)
    }
}
