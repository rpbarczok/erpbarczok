import { createNewError } from './error.js'
import { baseLogger } from '../logger.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyTypeNorm } from '../controllers/company-types/index.js'

const logger = baseLogger.extend('services:companyTypes')

export const getAllCompanyTypes = async () => {
    logger('Get all company types')
    try {
        const companyTypes = await CompanyType.findAll({ order: [['name', 'ASC']] })
        logger('Got all company types')
        return companyTypes
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const addCompanyType = async (companyType: CompanyTypeNorm) => {
    const newCompanyType = {
        name: companyType.name
    }
    try {
        const addedCompanyType = await CompanyType.create(newCompanyType)
        return addedCompanyType
    } catch (error) {
        return createNewError(500, error.message)
    }
}

export const getCompanyTypeById = async (id: number) => {
    try {
        const companyType = await CompanyType.findByPk(id)
        if (companyType === null) {
            return createNewError(404)
        } else {
            return companyType
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const deleteCompanyTypeById = async (id: number) => {
    try {
        const deletedRowsCount = await CompanyType.destroy({ where: { id: id } })
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

export const putCompanyTypeById = async (id: number, companyType: CompanyTypeNorm) => {
    try {
        const oldCompanyType = await CompanyType.findByPk(id)
        if (oldCompanyType === null) {
            return createNewError(404)
        } else {
            const updatedCompanyType = await oldCompanyType.update(companyType)
            return updatedCompanyType
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}