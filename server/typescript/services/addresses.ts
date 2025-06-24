/*
Copyright (c) 2025 Ralph Barczok
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { baseLogger } from "../logger.js"
import { Address } from "../models/addresses.js"
import { getAddressTypeByName } from "./addressTypes.js"
import { getCompanyById } from "./companies.js"
import { getCountryByName } from "./countries.js"

export interface AddressNorm {
    street: string
    addition?: string
    city: string
    po: string
    country: string
    addressType: string
}

export const getAllAddressesByCompany = async (companyId: number) => {
    const logger = baseLogger.extend('getAllAddressesByCompany')
    const addresses = await Address.findAll({where: {companyId: companyId}})
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
    const addedAddressInclude = await Address.findByPk(addedAddress.id, {include: ['Country', 'AddressType']})
    if (addedAddressInclude) {
        logger('Address added.')
        return addedAddressInclude
    } else throw new Error('address.findByPk did not return freshly created company.')

}

// export const getAddressById

// export const deleteCompanyById

// export const putCompanyById