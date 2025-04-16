import { expect } from 'expect'
import './utils/env.test.js'
import { getAllFields, getFieldById, deleteFieldById, putFieldById, addField } from '../services/fields.js'
import { sequelize } from '../models/index.js'

describe('Field Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllFields / addField', function () {
        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllFields()).resolves.toHaveLength(0)
        })

        it('addField works and returns 1', async function () {
            await expect(addField({ name: 'Lebensmittel' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Lebensmittel', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second field with addField succeeds and returns 2', async function () {
            await expect(addField({ name: 'Haushaltsgeräte' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Haushaltsgeräte', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllFields returns 1 und 2 with names', async function () {
            await expect(getAllFields()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Haushaltsgeräte', updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Lebensmittel', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getFieldById(id)', function () {
        it("getFieldById(1) returns {'id': 1, 'name': 'Lebensmittel'}", async function () {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Lebensmittel', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getFieldById(17) returns error', async function () {
            await expect(getFieldById(17)).rejects.toEqual(
                expect.objectContaining({ status: 404, message: 'Not found.' })
            )
        })
    })

    describe('Test putFieldById(id)', function () {
        it("putFieldById(1) change name to 'Spediteur'", async function () {
            await expect(putFieldById(1, { 'name': 'Spediteur' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getFieldById(1) returns {'id': 1, 'name': 'Spediteur'} after Name Change", async function () {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putFieldId(1) remove name returns unchanged field', async function () {
            //@ts-expect-error -- provokes mistake to test reaction of db
            await expect(putFieldById(1, {})).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getFieldById(1) returns {'id': 1, 'name': 'Spediteur'}", async function () {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Spediteur', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putFieldById(17) returns error', async function () {
            await expect(putFieldById(17, { 'name': 'Sonstiges' })).rejects.toEqual(
                expect.objectContaining({ status: 404, message: 'Not found.' }
                ))
        })
    })

    describe('Test DeleteFieldById', function () {
        it('deleteFieldById succeeds', async function () {
            await expect(deleteFieldById(1)).resolves.toBeUndefined()
        })

        it('subsequent deleteFieldById(1) rejects to Error', async function () {
            await expect(deleteFieldById(1)).rejects.toEqual(
                expect.objectContaining({ status: 404, message: 'Not found.' })
            )
        })

        it('getAllFields returns only /fields/2', async function () {
            await expect(getAllFields()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Haushaltsgeräte', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})