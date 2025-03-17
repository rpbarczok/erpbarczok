import { error_formatter, NotFoundError } from './error.js'
import { baseLogger } from "../logger.js"
import { Field } from "../models/fields.js"
import { FieldNorm } from "../controllers/fields/index.js"

const logger = baseLogger.extend("services:fields")

export const getAllFields = () => new Promise<Field[]>(async function (resolve, reject) {
    try {
        const fields = await Field.findAll({ order: [['name', 'ASC']] })
        resolve(fields)
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const addField = (field: FieldNorm) => new Promise<Field>(async function (resolve, reject) {
    const newField = {
        name: field.name
    }
    try {
        const addedField = await Field.create(newField)
        resolve(addedField)
    } catch (err) {
        reject(error_formatter(500, err))
    }
})

export const getFieldById = (id: number) => new Promise<Field>(async function (resolve, reject) {
    try {
        const field = await Field.findByPk(id)
        if (field === null) {
            reject(new NotFoundError())
        } else {
            resolve(field)
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})

export const deleteFieldById = (id: number) => new Promise<void>(async (resolve, reject) => {
    try {
        const deletedRowsCount = await Field.destroy({ where: { id: id } })
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
export const putFieldById = (id: number, field: FieldNorm) => new Promise<Field>(async (resolve, reject) => {
    try {
        const oldField = await Field.findByPk(id)
        if (oldField === null) {
            reject(new NotFoundError())
        } else {
            const updatedField = await oldField.update(field)
            resolve(updatedField)
        }
    }
    catch (err) {
        reject(error_formatter(500, err))
    }
})