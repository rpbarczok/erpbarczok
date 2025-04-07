import { expect } from 'expect'
import './utils/env.test.js'
import { getAllCompanyTypes, getCompanyTypeById, deleteCompanyTypeById, putCompanyTypeById, addCompanyType, } from '../services/companyTypes.js'
import { sequelize } from '../models/index.js'
import { ErrorWithStatus } from '../services/error.js'


describe('CompanyType Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllCompanyTypes / addCompanyType', function () {
        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllCompanyTypes()).resolves.toHaveLength(0)
        })

        it('addCompanyType works and returns 1', async function () {
            await expect(addCompanyType({ name: 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Kunde', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second companyType with addCompanyType succeeds and returns 2', async function () {
            await expect(addCompanyType({ name: 'Lieferant' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferant', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllCompanyTypes returns 1 und 2 with names', async function () {
            await expect(getAllCompanyTypes()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Kunde', updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferant', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getCompanyTypeById(id)', function () {
        it("getCompanyTypeById(1) returns {'id': 1, 'name': 'Kunde'}", async function () {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Kunde', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getCompanyTypeById(17) returns error', async function () {
            await expect(getCompanyTypeById(17)).resolves.toEqual(
                expect.objectContaining({status: 404, message: 'not found'})
            )
        })
    })

    describe('Test putCompanyTypeById(id)', function () {
        it("putCompanyTypeById(1) change name to 'Spediteur'", async function () {
            await expect(putCompanyTypeById(1, { 'name': 'Spediteur' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getCompanyTypeById(1) returns {'id': 1, 'name': 'Spediteur'} after Name Change", async function () {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCompanyTypeId(1) remove name returns error', async function () {
            // @ts-expect-error Provoke error by giving object without props.
            await expect(putCompanyTypeById(1, {})).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getCompanyTypeById(1) returns {'id': 1, 'name': 'Spediteur'}", async function () {
            await expect(getCompanyTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCompanyTypeById(17) returns error', async function () {
            await expect(putCompanyTypeById(17, { 'name': 'Sonstiges' })).resolves.toBeInstanceOf(ErrorWithStatus)
        })
    })

    describe('Test DeleteCompanyTypeById', function () {
        it('deleteCompanyTypeById resolves', async function () {
            await expect(deleteCompanyTypeById(1)).resolves.toBeUndefined()
        })

        it('subsequent deleteCompanyTypeById(1) throws NotFoundError', async function () {
            await expect(deleteCompanyTypeById(1)).resolves.toEqual(
                expect.objectContaining({status: 404, message: 'not found'})
            )
        })

        it('getAllCompanyTypes returns only /company-types/2', async function () {
            await expect(getAllCompanyTypes()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferant', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})