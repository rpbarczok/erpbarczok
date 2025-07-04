import './utils/env.test.js'
import { expect } from "expect"
import { sequelize } from "../models/index.js"
import { CompanyType } from '../models/companyTypes.js'
import { Company } from '../models/companies.js'
import { addAddressToCompany, AddressNorm, deleteAddressById, getAddressById, getAllAddressesByCompany, putAddressById } from '../services/addresses.js'
import { Country } from '../models/countries.js'
import { AddressType } from '../models/addressTypes.js'

const address1Input: AddressNorm = {
    street: "Poststraße 1",
    po: "1111",
    city: "Berlin",
    country: "Deutschland",
    addressType: "Unternehmensadresse"
}
const address1Output = {
    'id': 1,
    'street': 'Poststraße 1',
    'po': '1111',
    'city':
        'Berlin',
    countryId: 1,
    addressTypeId: 1,
    companyId: 1,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
}

const address2Input: AddressNorm = {
    street: "Turmstraße 1",
    po: "1112",
    city: "Potsdam",
    country: "Deutschland",
    addressType: "Unternehmensadresse"
}
const address2Output = { 'id': 2, 'street': 'Turmstraße 1', 'po': '1112', 'city': 'Potsdam', countryId: 1, addressTypeId: 1, companyId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }

const address3Input: AddressNorm = {
    street: "Schillerstraße 1",
    po: "1113",
    city: "Dresden",
    country: "Deutschland",
    addressType: "Unternehmensadresse"
}

const address3Output = { 'id': 3, 'street': 'Schillerstraße 1', 'po': '1113', 'city': 'Dresden', countryId: 1, addressTypeId: 1, companyId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) }
describe('Address Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
        await CompanyType.create(
            { name: "Lieferant" }
        )
        await Company.bulkCreate([{
            name: "Firma A",
            companyTypeId: 1
        },
        {
            name: "Firma B",
            companyTypeId: 1
        }
        ])
        await Country.bulkCreate([
            {
                name: 'Deutschland',
                abbr: 'DEU',
                isEU: true
            },
            {
                name: 'Österreich',
                abbr: 'AUT',
                isEU: true
            }]
        )
        await AddressType.bulkCreate([
            {
                name: 'Unternehmensadresse'
            },
            {
                name: 'Lieferadresse'
            }
        ])
    })

    describe('Test getAllAddressesByCompany / addAddressToCompany', function () {

        it('getAllAddressesByCompany should return [] for a fresh and empty DB', async function () {
            await expect(getAllAddressesByCompany(1)).resolves.toHaveLength(0)
        })

        it('add address to company 1', async function () {
            await expect(addAddressToCompany(1, address1Input)).resolves.toEqual(
                expect.objectContaining(address1Output)
            )
        })

        it('add second address to company 1', async function () {
            await expect(addAddressToCompany(1, address2Input)).resolves.toEqual(
                expect.objectContaining(address2Output)
            )
        })

        it('add third address to company 2', async function () {
            await expect(addAddressToCompany(2, address3Input)).resolves.toEqual(
                expect.objectContaining(address3Output)
            )
        })

        it('getAllAddressesByCompany(1) should return Addresses 1 and 2', async function () {
            await expect(getAllAddressesByCompany(1)).resolves.toHaveLength(2)
        })

        it('getAllAddressesByCompany(2) should return address 3', async function () {
            await expect(getAllAddressesByCompany(2)).resolves.toHaveLength(1)
        })
    })

    describe('Test getAddressById(id)', function () {

        it('getAddressById(1) returns Address 1', async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining(address1Output)
            )
        })

        it('getAddressByID(2) returns Address 2', async function () {
            await expect(getAddressById(2)).resolves.toEqual(
                expect.objectContaining(address2Output)
            )
        })

        it('getAddressById(17) returns error', async function () {
            await expect(getAddressById(17)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Address with id 17.' })
            )
        })
    })

    describe('Test putAddressById(id)', function () {

        it("putAddressById(1) change name to 'Poststraße 2'", async function () {
            await expect(putAddressById(1, { ...address1Input, street: "Poststraße 2" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, street: "Poststraße 2" }))
        })

        it("getAddressById(1) returns correct data after street change", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, street: "Poststraße 2" }))
        })

        it("putAddressById(1) change po to '4444'", async function () {
            await expect(putAddressById(1, { ...address1Input, po: "4444" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, po: "4444" }))
        })

        it("getAddressById(1) returns correct data after po change", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, po: "4444" }))
        })

        it("putAddressById(1) change city to 'Köln'", async function () {
            await expect(putAddressById(1, { ...address1Input, city: "Köln" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, city: "Köln" }))
        })

        it("getAddressById(1) returns correct data after city change", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, city: "Köln" }))
        })

        it("putAddressById(1) change address type to 'Lieferadresse'", async function () {
            await expect(putAddressById(1, { ...address1Input, addressType: "Lieferadresse" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, addressTypeId: 2 }))
        })

        it("getAddressById(1) returns correct data after address type change", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, addressTypeId: 2 }))
        })

        it("putAddressById(1) changes country to 'Österreich'", async function () {
            await expect(putAddressById(1, { ...address1Input, country: "Österreich" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, countryId: 2 }))
        })

        it("getAddressById(1) returns correct data after country change", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, countryId: 2 }))
        })

        it("putAddressById(1) adds addition", async function () {
            await expect(putAddressById(1, { ...address1Input, addition: "c/o Mama" })).resolves.toEqual(
                expect.objectContaining({ ...address1Output, addition: "c/o Mama" })
            )
        })

        it("getAddressById(1) returns correct data after addition addition", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.objectContaining({ ...address1Output, addition: "c/o Mama" }))
        })

        it('putAddressById(1) removes addition', async function () {
            await expect(putAddressById(1, address1Input)).resolves.toEqual(
                expect.not.objectContaining({ addition: "c/o Mama" }))
        })

        it("getAddressById(1) returns correct data after www removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(
                expect.not.objectContaining({ addition: "c/o Mama" }))
        })

        it('putAddressById(1) remove street returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putAddressById(1, { po: "1111", city: "Berlin", country: "Deutschland", addressType: "Unternehmensadresse" })).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressById(1) returns original address after unsuccessful street removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(expect.objectContaining(address1Output))
        })


        it('putAddressById(1) remove po returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putAddressById(1, { street: "Poststraße 1", city: "Berlin", country: "Deutschland", addressType: "Unternehmensadresse" })).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressById(1) returns original address after unsuccessful po removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(expect.objectContaining(address1Output))
        })

        it('putAddressById(1) removes city returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putAddressById(1, { street: "Poststraße 1", po: "1111", country: "Deutschland", addressType: "Unternehmensadresse" })).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressById(1) returns original address after unsuccessful city removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(expect.objectContaining(address1Output))
        })

        it('putAddressById(1) remove country returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putAddressById(1, { street: "Poststraße 1", po: "1111", city: "Berlin", addressType: "Unternehmensadresse" })).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressById(1) returns original address after unsuccessful country removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(expect.objectContaining(address1Output))
        })

        it('putAddressById(1) remove address type returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putAddressById(1, { street: "Poststraße 1", po: "1111", city: "Berlin", country: "Deutschland" })).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressById(1) returns original address after unsuccessful address type removal", async function () {
            await expect(getAddressById(1)).resolves.toEqual(expect.objectContaining(address1Output))

        })

        it('putAddressById(17) returns error', async function () {
            await expect(putAddressById(17, address1Input)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Address 17.' })
            )
        })

    })

        describe('Test DeleteCompanyById', function () {

            it('deleteAddressById resolves', async function () {
                await expect(deleteAddressById(1)).resolves.toBeUndefined()
            })

            it('subsequent deleteAddressById(1) resolves to Error', async function () {
                await expect(deleteAddressById(1)).rejects.toEqual(
                    expect.objectContaining({message: 'Not found: Address with id 1.'})
                )
            })
            
            it('getAllAddress returns only 2', async function () {
                await expect(getAllAddressesByCompany(1)).resolves.toEqual(
                    [expect.objectContaining(address2Output)
                    ])
            })
        })

})