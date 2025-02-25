import { expect } from 'expect'
import './utils/env.test.js'
import { getAllCompanies, addCompany, getCompanyById, deleteCompanyById, putCompanyById } from '../services/companies.js'
import {sequelize} from '../models/index.js'
import { NotFoundError } from '../services/error.js'
import { Company } from '../models/companies.js'
import { Companytype } from '../models/companytypes.js'

describe('Company Unit Tests', async function () {
    this.timeout(5000)
    before(async function () {
        await sequelize.sync({ force: true })
        Companytype.bulkCreate([
            {
                name: "Kunde"
            },
            {
                name: "Lieferant"
            }
        ])
    })

    describe('test getAllCompanies / addCompany', function () {

        it('should return [] for a fresh and empty DB', async () => {
            await expect(getAllCompanies()).resolves.toHaveLength(0)
        })

        it('addCompany works with name and abbr and returns /companies/1', async () => {
            await expect(addCompany({ name: "Firma A", abbr: "FRA", www: "www.firmaa.com", companytype: "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma A", "abbr": "FRA", "www": "www.firmaa.com", companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            )
        })

        it('addCompany works with name  and returns /companies/2', async () => {
            await expect(addCompany({ name: "Firma B", companytype: "Lieferant" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 2, "name": "Firma B", "abbr": null, "www": null, companytypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            )
        })

        it('getAllCompanies returns 1 und 2', async () => {
            await expect(getAllCompanies()).resolves.toEqual([
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma A", "abbr": "FRA", "www": "www.firmaa.com", companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                expect.any(Company) && expect.objectContaining({ "id": 2, "name": "Firma B", "abbr": null, "www": null, companytypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            ])
        })
    })

    describe('Test getCompanyById(id)', function () {

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRC", www: "www.firmaa.com", companytypeId: 1 }', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma A", "abbr": "FRA", "www": "www.firmaa.com", companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(2) returns {"id": 2, "name": "Firma B", "abbr": null, www: null, CompantytypeId: 2 }', async () => {
            await expect(getCompanyById(2)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 2, "name": "Firma B", "abbr": null, "www": null, companytypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(17) returns error', async () => {
            await expect(getCompanyById(17)).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test putCompanyById(id)', function () {

        it('putCompanyById(1) change name to "Firma C"', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRA", companytype: "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": "FRA", "www": null, companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRA", "www": null, companytypeId: 1} after Name Change', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": "FRA", "www": null,
                        companytypeId: 1,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) adds www', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRA", "www": "www.example.de", "companytype": "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": "FRA", "www": "www.example.de", companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRA", "www": "www.example.de", "companytypeId": 1} after www addition', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": "FRA",
                        "www": "www.example.de",
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) removes www', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRA", "companytype": "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": "FRA", "www": null, companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRA", "www": null} after www removal', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr":
                            "FRA",
                        "www": null,
                        companytypeId: 1,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) remove abbr', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "companytype": "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": null, "www": null, companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": null, "www": null, "companytype": "Kunde"} after abbr removal', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": null,
                        "www": null,
                        companytypeId: 1,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) add abbr', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRC", "companytype": "Kunde" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": "FRC", "www": null, companytypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRC", "companytype": "Kunde"} after abbr addition', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": "FRC",
                        "www": null,
                        companytypeId: 1,
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) remove name returns error', async () => {
            // @ts-ignore:next-line
            await expect(putCompanyById(1, { "abbr": "FRA", "companytype": "Kunde" })).rejects.toEqual({status: 400, message: "Bad request"})
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRC, "www": null, "companytype": "Kunde"} after unsuccessful delete', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": "FRC",
                        "www": null,
                        companytypeId: 1,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(17) returns error', async () => {
            await expect(putCompanyById(17, { "name": "Firma D", "abbr": "FRD", "companytype": "Kunde" })).rejects.toBeInstanceOf(NotFoundError)
        })

        it('putCompanyById(1) remove companytype returns error', async () => {
            // @ts-ignore:next-line
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRC" })).rejects.toEqual({status: 400, message: "Bad request"})
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRC, "www": null, "companytype": "Kunde"} after unsuccessful delete', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name":
                            "Firma C",
                        "abbr": "FRC",
                        "www": null,
                        companytypeId: 1,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 1, name: "Kunde", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) successful change companytype', async () => {
            await expect(putCompanyById(1, { "name": "Firma C", "abbr": "FRC", "companytype": "Lieferant" })).resolves.toEqual(
                expect.any(Company) && expect.objectContaining({ "id": 1, "name": "Firma C", "abbr": "FRC", "www": null, companytypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Firma C", "abbr": "FRC, "www": null, "companytype": "Lieferant"} after successful companytype change', async () => {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.any(Company) && expect.objectContaining(
                    {
                        "id": 1,
                        "name": "Firma C",
                        "abbr": "FRC",
                        "www": null,
                        companytypeId: 2,
                        companytype: expect.any(Companytype) && expect.objectContaining({ id: 2, name: "Lieferant", createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })
    })

    describe('Test DeleteCompanyById', function () {

        it('deleteCompanyById resolves', async () => {
            await expect(deleteCompanyById(1)).resolves.toBeUndefined
        })

        it('subsequent deleteCompanyById(1) throws NotFoundError', async () => {
            await expect(deleteCompanyById(1)).rejects.toBeInstanceOf(NotFoundError)
        })

        it('getAllCompanies returns only 2', async () => {
            await expect(getAllCompanies()).resolves.toEqual(
                [expect.any(Company) && expect.objectContaining({ "id": 2, "name": "Firma B", "abbr": null, "www": null, companytypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
                ])
        })
    })
})