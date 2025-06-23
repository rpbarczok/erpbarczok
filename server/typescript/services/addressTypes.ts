import { AddressTypeNorm } from '../controllers/address-types/index.js'
import { baseLogger } from '../logger.js'
import { AddressType } from '../models/addressTypes.js'
import { NotFoundError, ValidationError } from './servicesError.js'

export const getAllAddressTypes = async () => {
    const logger = baseLogger.extend('getAllAddressTypes')
    const addressTypes = await AddressType.findAll({ order: [['name', 'ASC']] })
    logger('Got all address types.')
    return addressTypes
}

export const addAddressType = async (addressType: AddressTypeNorm) => {
    if (addressType.name) {
        const logger = baseLogger.extend('addAddressType')
        const newAddressType = { name: addressType.name }
        const addedAddressType = await AddressType.create(newAddressType)
        logger('Added new address type.')
        return addedAddressType
    } else throw new ValidationError()
}

export const getAddressTypeById = async (id: number) => {
    const logger = baseLogger.extend('getAddressTypeById')
    const addressType = await AddressType.findByPk(id)
    if (addressType === null) {
        throw new NotFoundError(`Not found: Address type with id ${String(id)}.`)
    } else {
        logger(`Got address type with id ${String(id)}`)
        return addressType
    }
}

export const getAddressTypeByName = async (name: string) => {
    const logger = baseLogger.extend('getAddressTypeByName')
    const addressType = await AddressType.findOne({where: {name: name}})
    if (addressType === null) {
        throw new NotFoundError(`Not found: Address type with name ${name}.`)
    } else {
        logger(`Address type with name ${name} found`)
        return addressType
    }
}

export const deleteAddressTypeById = async (id: number) => {
    const logger = baseLogger.extend('deleteAddressTypeById')
    const deletedRowsCount = await AddressType.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Address type with id ${String(id)}.`)
    } else {
        logger(`Deleted address type with id ${String(id)}.`)
        return
    }
}

export const putAddressTypeById = async (id: number, addressType: AddressTypeNorm) => {
    const logger = baseLogger.extend('putAddressTypeById')
    if (addressType.name) {
        const oldAddressType = await AddressType.findByPk(id)
        if (oldAddressType !== null) {
            const updatedAddressType = await oldAddressType.update(addressType)
            logger(`Updated address type with id ${String(id)}.`)
            return updatedAddressType
        } else throw new NotFoundError(`Not found: Address type with id ${String(id)}.`)
    } else throw new ValidationError()
}