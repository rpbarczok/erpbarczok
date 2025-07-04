/*
Copyright (c) 2025 Ralph Barczok
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { baseLogger } from "../logger.js"
import { Address } from "../models/addresses.js"
import { AddressType } from "../models/addressTypes.js"
import { Country } from "../models/countries.js"
import { getAddressTypeByName } from "./addressTypes.js"
import { getCompanyById } from "./companies.js"
import { getCountryByName } from "./countries.js"
import { AssociationNotFoundError, NotFoundError, ValidationError } from "./servicesError.js"

export interface AddressNorm {
    street: string
    addition?: string | null
    city: string
    po: string
    country: string
    addressType: string
}

export const isAddressNorm = (value: unknown): value is AddressNorm => {
    if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value)
        if (keys.includes('street') && keys.includes('city') && keys.includes('po') && keys.includes('country') && keys.includes('addressType')) {
            return (keys.every(key => ['street', 'addition', 'city', 'po', 'country', 'addressType'].includes(key)))
        }
    }
    return false
}


export interface AddressFK {
    street: string
    addition?: string | null
    city: string
    po: string
    countryId: number
    addressTypeId: number
}

export const getAllAddressesByCompany = async (companyId: number) => {
    const logger = baseLogger.extend('getAllAddressesByCompany')
    const addresses = await Address.findAll({ where: { companyId: companyId }, include: [Country, AddressType] })
    logger('Got all Addresses of Company')
    return addresses
}

export const addAddressToCompany = async (companyId: number, address: AddressNorm) => {
    const logger = baseLogger.extend('addAddressToCompany')
    const company = await getCompanyById(companyId)
    const country = await getCountryByName(address.country)
    const addressType = await getAddressTypeByName(address.addressType)
    const newAddress = {
        street: address.street,
        addition: address.addition,
        city: address.city,
        po: address.po,
        companyId: company.id,
        addressTypeId: addressType.id,
        countryId: country.id
    }
    const addedAddress = await Address.create(newAddress)

    const addedAddressInclude = await Address.findByPk(addedAddress.id, { include: [Country, AddressType] })
    if (addedAddressInclude) {
        logger('Address added.')
        return addedAddressInclude
    } else throw new Error('address.findByPk did not return freshly created company.')

}

export const getAddressById = async (id: number) => {
    const logger = baseLogger.extend('getAddressById')
    const address = await Address.findByPk(id, { include: [Country, AddressType] })
    if (address === null) {
        throw new NotFoundError(`Not found: Address with id ${String(id)}.`)
    } else {
        logger(`Got address with id ${String(id)}.`)
        return address
    }
}

export const deleteAddressById = async (id: number) => {
    const logger = baseLogger.extend('deleteAddressById')
    const deletedRowsCount = await Address.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Address with id ${String(id)}.`)
    } else {
        logger(`Deleted address with id ${String(id)}.`)
        return
    }
}

export const putAddressById = async (id: number, address: AddressNorm) => {
    const logger = baseLogger.extend('putAddressById')
    if (address.street && address.addressType && address.city && address.country && address.po) {
        const oldAddress = await Address.findByPk(id, { include: [AddressType, Country] })
        if (oldAddress !== null) {
            const addressType = await AddressType.findOne({ where: { name: address.addressType } })
            if (addressType) {
                const country = await Country.findOne({ where: { name: address.country } })
                if (country) {
                    const data: AddressFK = { street: address.street, city: address.city, po: address.po, countryId: country.id, addressTypeId: addressType.id }
                    data.addition = address.addition ?? null
                    const updatedAddress = await oldAddress.update(data)
                    const updatedAddressInclude = await Address.findByPk(updatedAddress.id, { include: [AddressType, Country] })
                    if (updatedAddressInclude) {
                        logger(`Updated address with id ${String(id)}.`)
                        return updatedAddressInclude
                    } else throw new NotFoundError(`Not found: freshly updated address was not found.`)

                } else throw new AssociationNotFoundError(`Association not found: Address type ${address.country}`)

            } else throw new AssociationNotFoundError(`Association not found: Address type ${address.addressType}`)
        } else throw new NotFoundError(`Not found: Address ${String(id)}.`)
    } else throw new ValidationError()

}