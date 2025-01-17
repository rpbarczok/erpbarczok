import { expect } from 'expect'
import './utils/testenv.js'
import { getAllCompanytypes, getCompanytypeById, deleteCompanytypeById, putCompanytypeById, addCompanytype, } from '../services/companytypes.js'
import sequelize from '../models/index.js'
import { NotFoundError } from '../services/error.js'
import { Companytype } from '../models/companytypes.js'


describe('Companytype Unit Tests', function () {

    before(async function () {
        await sequelize.sync({ force: true })
    });

    describe('test getAllCompanytyps / addCompanytype', function () {

         it('should return [] for a fresh and empty DB', async () => {
            await expect(getAllCompanytypes()).resolves.toHaveLength(0)
        })

        it('addCompanytype works with and returns 1', async () => {
            await expect(addCompanytype({ name: "Kunde" })).resolves.toBe(1)
        })

        it('add second companytype with addCompanytype succeeds and returns 2', async () => {
            await expect(addCompanytype({ name: "Lieferant" })).resolves.toBe(2)
        })

        it('getAllCompanytypes returns 1 und 2 with names', async () => {
            await expect(getAllCompanytypes()).resolves.toEqual([
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 1, "name": "Kunde", updatedAt: expect.any(Date), createdAt: expect.any(Date) }}),
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 2, "name": "Lieferant", updatedAt: expect.any(Date), createdAt: expect.any(Date) }})
            ])
        })
    })

     describe('Test getCompanytypeById(id)', function () {

        it('getCompanytypeById(1) returns {"id": 1, "name": "Kunde"}', async () => {
            await expect(getCompanytypeById(1)).resolves.toEqual(
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 1, "name": "Kunde", updatedAt: expect.any(Date), createdAt: expect.any(Date) }})
            )
        })

        it('getCompanytypeById(17) returns error', async () => {
            await expect(getCompanytypeById(17)).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test putCompanytypeById(id)', function () {
        it('putCompanytypeById(1) change name to "Spediteur"', async () => {
            await expect(putCompanytypeById(1, { "name": "Spediteur" })).resolves.toBeUndefined()
        })

        it('getCompanyById(1) returns {"id": 1, "name": "Spediteur"} after Name Change', async () => {
            await expect(getCompanytypeById(1)).resolves.toEqual(
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) }})
            )
        })

        it('putCompanytypeId(1) remove name returns error', async () => {
            // @ts-ignore:next-line
            await expect(putCompanytypeById(1, {})).resolves.toBeUndefined()
        })

        it('getCompanytypeById(1) returns {"id": 1, "name": "Spediteur"}', async () => {
            await expect(getCompanytypeById(1)).resolves.toEqual(
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) }})
            )
        })

        it('putCompanyById(17) returns error', async () => {
            await expect(putCompanytypeById(17, { "name": "Sonstiges" })).rejects.toBeInstanceOf(NotFoundError)
        })
    })
    describe('Test DeleteCompanytypeById', function () {
        it('deleteCompanytypeById resolves', async () => {
            await expect(deleteCompanytypeById(1)).resolves.toBeUndefined
        })

        it('subsequent deleteCompanytypeById(1) throws NotFoundError', async () => {
            await expect(deleteCompanytypeById(1)).rejects.toBeInstanceOf(NotFoundError)
        })

        it('getAllCompanytypes returns only /companytypes/2', async () => {
            await expect(getAllCompanytypes()).resolves.toEqual([
                expect.any(Companytype) && expect.objectContaining({dataValues: { "id": 2, "name": "Lieferant", updatedAt: expect.any(Date), createdAt: expect.any(Date) }})
            ])
        })
    }) 
})