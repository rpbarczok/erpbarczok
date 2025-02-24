import { error_formatter, NotFoundError } from './error.js'
import { baseLogger } from "../logger.js"
import { Companytype } from "../models/companytypes.js"
import { CompanytypeServer } from "../controllers/companytypes/index.js"

const logger = baseLogger.extend("services:companytypes")

export const getAllCompanytypes = () => new Promise<Companytype[]>(async function (resolve, reject) {
    try {
        const companytypes = await Companytype.findAll({ order: [['name', 'ASC']] })
        resolve(companytypes)
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const addCompanytype = (companytype: CompanytypeServer) => new Promise<Companytype>(async function (resolve, reject) {
    const newCompanytype = {
        name: companytype.name
    }
    try {
        const addedCompanytype = await Companytype.create(newCompanytype)
        resolve(addedCompanytype)
    } catch (err) {
        reject(error_formatter(500, err))
    }
})

export const getCompanytypeById = (id: number) => new Promise<Companytype>(async function (resolve, reject) {
    try {
        const companytype = await Companytype.findByPk(id)
        if (companytype === null) {
            reject(new NotFoundError())
        } else {
            resolve(companytype)
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const deleteCompanytypeById = (id: number) => new Promise<void>(async (resolve, reject) => {
    try {
        const deletedRowsCount = await Companytype.destroy({ where: { id: id } })
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
export const putCompanytypeById = (id: number, companytype: CompanytypeServer) => new Promise<Companytype>(async (resolve, reject) => {
    try {
        const oldCompanytype = await Companytype.findByPk(id)
        if (oldCompanytype === null) {
            reject(new NotFoundError())
        } else {
            const updatedCompanytype = await oldCompanytype.update(companytype)
            resolve(updatedCompanytype)
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})