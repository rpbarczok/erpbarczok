import { expect } from 'expect'
import './utils/env.test.js'
import { getAllAddressTypes, getAddressTypeById, deleteAddressTypeById, putAddressTypeById, addAddressType, } from '../services/addressTypes.js'
import { sequelize } from '../models/index.js'


describe('AddressType Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllAddressTypes / addAddressType', function () {
        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllAddressTypes()).resolves.toHaveLength(0)
        })

        it('addAddressType works and returns 1', async function () {
            await expect(addAddressType({ name: 'Unternehmensadresse' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Unternehmensadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second addressType with addAddressType succeeds and returns 2', async function () {
            await expect(addAddressType({ name: 'Lieferadresse' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllAddressTypes returns 1 und 2 with names', async function () {
            await expect(getAllAddressTypes()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Unternehmensadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getAddressTypeById(id)', function () {
        it("getAddressTypeById(1) returns {'id': 1, 'name': 'Unternehmensadresse'}", async function () {
            await expect(getAddressTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Unternehmensadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAddressTypeById(17) returns error', async function () {
            await expect(getAddressTypeById(17)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Address type with id 17.'})
            )
        })
    })

    describe('Test putAddressTypeById(id)', function () {
        it("putAddressTypeById(1) change name to 'Rechnungsadresse'", async function () {
            await expect(putAddressTypeById(1, { 'name': 'Rechnungsadresse' })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Rechnungsadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getAddressTypeById(1) returns {'id': 1, 'name': 'Rechnungsadresse'} after Name Change", async function () {
            await expect(getAddressTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Rechnungsadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putAddressTypeId(1) remove name returns error', async function () {
            // @ts-expect-error Provoke error by giving object without props.
            await expect(putAddressTypeById(1, {})).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getAddressTypeById(1) returns {'id': 1, 'name': 'Rechnungsadresse'}", async function () {
            await expect(getAddressTypeById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Rechnungsadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putAddressTypeById(17) returns error', async function () {
            await expect(putAddressTypeById(17, { 'name': 'Sonstiges' })).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Address type with id 17.' })
            )
        })
    })

    describe('Test DeleteAddressTypeById', function () {
        it('deleteAddressTypeById resolves', async function () {
            await expect(deleteAddressTypeById(1)).resolves.toBeUndefined()
        })

        it('subsequent deleteAddressTypeById(1) throws 404 error', async function () {
            await expect(deleteAddressTypeById(1)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Address type with id 1.' })
            )
        })

        it('getAllAddressTypes returns only /address-types/2', async function () {
            await expect(getAllAddressTypes()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'Lieferadresse', updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})