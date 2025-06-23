/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { Company } from '../models/companies.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyNorm, CompanyFK } from '../controllers/companies/index.js'
import { baseLogger } from '../logger.js'
import { AssociationNotFoundError, NotFoundError, ValidationError } from './servicesError.js'
import { getCompanyTypeByName } from './companyTypes.js'

export const getAllCompanies = async () => {
    const logger = baseLogger.extend('getAllCompanies')
    const companies = await Company.findAll({ include: CompanyType, order: [['name', 'ASC']] })
    logger('Got all Companies.')
    return companies
}

export const addCompany = async (company: CompanyNorm) => {
    const logger = baseLogger.extend('addCompanies')
    if (company.name && company.companyType) {
        const companyType = await getCompanyTypeByName(company.companyType)
        const newCompany = { name: company.name, companyTypeId: companyType.id, abbr: company.abbr, www: company.www }
        const addedCompany = await Company.create(newCompany)
        const addedCompanyInclude = await Company.findByPk(addedCompany.id, { include: CompanyType })
        if (addedCompanyInclude) {
            logger('Added company.')
            return addedCompanyInclude
        } else throw new Error('company.findByPK did not return freshly created company.')
    } else throw new ValidationError()
}

export const getCompanyById = async (id: number) => {
    const logger = baseLogger.extend('getCompanyById')
    const company = await Company.findByPk(id, { include: CompanyType })
    if (company === null) {
        throw new NotFoundError(`Not found: Company with id ${String(id)}.`)
    } else {
        logger(`Got company with id ${String(id)}.`)
        return company
    }
}

export const deleteCompanyById = async (id: number) => {
    const logger = baseLogger.extend('deleteCompanyById')
    const deletedRowsCount = await Company.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Company with id ${String(id)}.`)
    } else {
        logger(`Deleted company with id ${String(id)}.`)
        return
    }
}

export const putCompanyById = async (id: number, company: CompanyNorm): Promise<Company> => {
    const logger = baseLogger.extend('putCompanyById')
    if (company.name && company.companyType) {
        const oldCompany = await Company.findByPk(id, { include: CompanyType })
        if (oldCompany !== null) {
            const companyType = await CompanyType.findOne({ where: { name: company.companyType } })
            if (companyType) {
                const data: CompanyFK = { name: company.name, companyTypeId: companyType.id }
                data.abbr = company.abbr ?? null
                data.www = company.www ?? null
                const updatedCompany = await oldCompany.update(data)
                const updatedCompanyInclude = await Company.findByPk(updatedCompany.id, { include: CompanyType })
                if (updatedCompanyInclude) {
                    logger(`Updated company with id ${String(id)}.`)
                    return updatedCompanyInclude
                } else throw new NotFoundError(`Not found: freshly updated company was not found.`)
            } else throw new AssociationNotFoundError(`company type ${company.companyType}`)
        } else throw new NotFoundError(`Not found: company ${String(id)}.`)
    } else throw new ValidationError()
}