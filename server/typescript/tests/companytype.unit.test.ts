import { expect } from 'expect'
import './utils/env.test.js'
import { getAllCompanyTypes, getCompanyTypeById, deleteCompanyTypeById, putCompanyTypeById, addCompanyType, } from '../services/companyTypes.js'
import { sequelize } from '../models/index.js'
import { NotFoundError } from '../services/error.js'
import { CompanyType } from '../models/companyTypes.js'


describe('CompanyType Unit Tests', async function () {
    this.timeout(5000)
    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllCompanyTypes / addCompanyType', async function () {
        it('should return [] for a fresh and empty DB', async () => {
            await expect(getAllCompanyTypes()).resolves.toHaveLength(0)
        })

        it('addCompanyType works and returns 1', async () => {
            await expect(addCompanyType({ name: "Kunde" })).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Kunde", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second companyType with addCompanyType succeeds and returns 2', async () => {
            await expect(addCompanyType({ name: "Lieferant" })).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 2, "name": "Lieferant", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllCompanyTypes returns 1 und 2 with names', async () => {
            await expect(getAllCompanyTypes()).resolves.toEqual([
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Kunde", updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 2, "name": "Lieferant", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getCompanyTypeById(id)', async function () {
        it('getCompanyTypeById(1) returns {"id": 1, "name": "Kunde"}', async () => {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Kunde", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getCompanyTypeById(17) returns error', async () => {
            await expect(getCompanyTypeById(17)).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test putCompanyTypeById(id)', async function () {
        it('putCompanyTypeById(1) change name to "Spediteur"', async () => {
            await expect(putCompanyTypeById(1, { "name": "Spediteur" })).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getCompanyTypeById(1) returns {"id": 1, "name": "Spediteur"} after Name Change', async () => {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCompanyTypeId(1) remove name returns error', async () => {
            // @ts-ignore:next-line
            await expect(putCompanyTypeById(1, {})).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getCompanyTypeById(1) returns {"id": 1, "name": "Spediteur"}', async () => {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCompanyTypeById(17) returns error', async () => {
            await expect(putCompanyTypeById(17, { "name": "Sonstiges" })).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test DeleteCompanyTypeById', async function () {
        it('deleteCompanyTypeById resolves', async () => {
            await expect(deleteCompanyTypeById(1)).resolves.toBeUndefined
        })

        it('subsequent deleteCompanyTypeById(1) throws NotFoundError', async () => {
            await expect(deleteCompanyTypeById(1)).rejects.toBeInstanceOf(NotFoundError)
        })

        it('getAllCompanyTypes returns only /company-types/2', async () => {
            await expect(getAllCompanyTypes()).resolves.toEqual([
                expect.any(CompanyType) && expect.objectContaining({ dataValues: { "id": 2, "name": "Lieferant", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})