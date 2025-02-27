import { expect } from 'expect'
import './utils/env.test.js'
import { getAllFields, getFieldById, deleteFieldById, putFieldById, addField, } from '../services/fields.js'
import { sequelize } from '../models/index.js'
import { NotFoundError } from '../services/error.js'
import { Field } from '../models/fields.js'


describe('Field Unit Tests', async function () {
    this.timeout(5000)
    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllFields / addField', async function () {
        it('should return [] for a fresh and empty DB', async () => {
            await expect(getAllFields()).resolves.toHaveLength(0)
        })

        it('addField works and returns 1', async () => {
            await expect(addField({ name: "Lebensmittel" })).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Lebensmittel", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second field with addField succeeds and returns 2', async () => {
            await expect(addField({ name: "Haushaltsgeräte" })).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 2, "name": "Haushaltsgeräte", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllFields returns 1 und 2 with names', async () => {
            await expect(getAllFields()).resolves.toEqual([
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 2, "name": "Haushaltsgeräte", updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Lebensmittel", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getFieldById(id)', async function () {
        it('getFieldById(1) returns {"id": 1, "name": "Lebensmittel"}', async () => {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Lebensmittel", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getFieldById(17) returns error', async () => {
            await expect(getFieldById(17)).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test putFieldById(id)', async function () {
        it('putFieldById(1) change name to "Spediteur"', async () => {
            await expect(putFieldById(1, { "name": "Spediteur" })).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getFieldById(1) returns {"id": 1, "name": "Spediteur"} after Name Change', async () => {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putFieldId(1) remove name returns error', async () => {
            // @ts-ignore:next-line
            await expect(putFieldById(1, {})).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getFieldById(1) returns {"id": 1, "name": "Spediteur"}', async () => {
            await expect(getFieldById(1)).resolves.toEqual(
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 1, "name": "Spediteur", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putFieldById(17) returns error', async () => {
            await expect(putFieldById(17, { "name": "Sonstiges" })).rejects.toBeInstanceOf(NotFoundError)
        })
    })

    describe('Test DeleteFieldById', async function () {
        it('deleteFieldById resolves', async () => {
            await expect(deleteFieldById(1)).resolves.toBeUndefined
        })

        it('subsequent deleteFieldById(1) throws NotFoundError', async () => {
            await expect(deleteFieldById(1)).rejects.toBeInstanceOf(NotFoundError)
        })

        it('getAllFields returns only /fields/2', async () => {
            await expect(getAllFields()).resolves.toEqual([
                expect.any(Field) && expect.objectContaining({ dataValues: { "id": 2, "name": "Haushaltsgeräte", updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})