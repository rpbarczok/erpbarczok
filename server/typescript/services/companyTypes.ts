import { error_formatter, NotFoundError } from './error.js'
import { baseLogger } from '../logger.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyTypeNorm } from '../controllers/company-types/index.js'

const logger = baseLogger.extend('services:companyTypes')

export const getAllCompanyTypes = () => new Promise<CompanyType[]>(async function (resolve, reject) {
    try {
        const companyTypes = await CompanyType.findAll({ order: [['name', 'ASC']] })
        resolve(companyTypes)
    }
    catch (error) {
        reject(error_formatter(500, error))
    }
})

export const addCompanyType = (companyType: CompanyTypeNorm) => new Promise<CompanyType>(async function (resolve, reject) {
    const newCompanyType = {
        name: companyType.name
    }
    try {
        const addedCompanyType = await CompanyType.create(newCompanyType)
        resolve(addedCompanyType)
    } catch (error) {
        reject(error_formatter(500, error))
    }
})

export const getCompanyTypeById = (id: number) => new Promise<CompanyType>(async function (resolve, reject) {
    try {
        const companyType = await CompanyType.findByPk(id)
        if (companyType === null) {
            reject(new NotFoundError())
        } else {
            resolve(companyType)
        }
    }
    catch (error) {
        reject(error_formatter(500, error))
    }
})

export const deleteCompanyTypeById = (id: number) => new Promise<void>(async (resolve, reject) => {
    try {
        const deletedRowsCount = await CompanyType.destroy({ where: { id: id } })
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
export const putCompanyTypeById = (id: number, companyType: CompanyTypeNorm) => new Promise<CompanyType>(async (resolve, reject) => {
    try {
        const oldCompanyType = await CompanyType.findByPk(id)
        if (oldCompanyType === null) {
            reject(new NotFoundError())
        } else {
            const updatedCompanyType = await oldCompanyType.update(companyType)
            resolve(updatedCompanyType)
        }
    }
    catch (error) {
        reject(error_formatter(500, error))
    }
})