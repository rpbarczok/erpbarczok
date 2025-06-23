import { expect } from 'expect'
import './utils/env.test.js'
import { getAllCountries, getCountryById, deleteCountryById, putCountryById, addCountry, getCountryByName, } from '../services/countries.js'
import { sequelize } from '../models/index.js'

describe('Country Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('test getAllCountries / addCountry', function () {
        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllCountries()).resolves.toHaveLength(0)
        })

        it('addCountry works and returns 1', async function () {
            await expect(addCountry({ name: 'Germany', abbr: 'DEU', isEU: true })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Germany', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('add second country with addCountry succeeds and returns 2', async function () {
            await expect(addCountry({ name: 'China', abbr: 'CHN', isEU: false })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'China', abbr: 'CHN', isEU: false, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getAllCountries returns 1 und 2 with names', async function () {
            await expect(getAllCountries()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'China', abbr: 'CHN', isEU: false, updatedAt: expect.any(Date), createdAt: expect.any(Date) } }),
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Germany', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })

    describe('Test getCountryById(id)', function () {
        it("getCountryById(1) returns {'id': 1, 'name': 'Kunde'}", async function () {
            await expect(getCountryById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Germany', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('getCountryById(17) returns error', async function () {
            await expect(getCountryById(17)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Country with id 17.' })
            )
        })
    })

    describe('Test getCountryByName(name)', function () {

        it("getCountryByName('Germany') succeeds", async function () {
            await expect(getCountryByName('Germany')).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Germany', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getCountryByName('Hawaii') fails", async function () {
            await expect(getCountryByName('Hawaii')).rejects.toEqual(
                 expect.objectContaining({ message: 'Not found: Country with name Hawaii.' })
            )
        })

    })

    describe('Test putCountryById(id)', function () {
        it("putCountryById(1) change name to 'Spediteur'", async function () {
            await expect(putCountryById(1, { 'name': 'Deutschland', abbr: 'DEU', isEU: true })).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Deutschland', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it("getCountryById(1) returns {'id': 1, 'name': 'Spediteur'} after Name Change", async function () {
            await expect(getCountryById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Deutschland', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCountryId(1) remove name returns error', async function () {
            // @ts-expect-error Provoke error by giving object without props.
            await expect(putCountryById(1, {})).rejects.toEqual(
                expect.objectContaining({ message: 'Bad request.' })
            )
        })

        it("getCountryById(1) returns {'id': 1, 'name': 'Spediteur'}", async function () {
            await expect(getCountryById(1)).resolves.toEqual(
                expect.objectContaining({ dataValues: { 'id': 1, 'name': 'Deutschland', abbr: 'DEU', isEU: true, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            )
        })

        it('putCountryById(17) returns error', async function () {
            await expect(putCountryById(17, { 'name': 'Sonstiges', abbr: 'son', isEU: false })).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Country with id 17.' })
            )
        })
    })

    describe('Test DeleteCountryById', function () {
        it('deleteCountryById resolves', async function () {
            await expect(deleteCountryById(1)).resolves.toBeUndefined()
        })

        it('subsequent deleteCountryById(1) throws 404 error', async function () {
            await expect(deleteCountryById(1)).rejects.toEqual(
                expect.objectContaining({ message: 'Not found: Country with id 1.' })
            )
        })

        it('getAllCountries returns only /countries/2', async function () {
            await expect(getAllCountries()).resolves.toEqual([
                expect.objectContaining({ dataValues: { 'id': 2, 'name': 'China', abbr: 'CHN', isEU: false, updatedAt: expect.any(Date), createdAt: expect.any(Date) } })
            ])
        })
    })
})