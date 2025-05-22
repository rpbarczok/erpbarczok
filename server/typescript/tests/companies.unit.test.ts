/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Portions Copyright (c) 2024 Joachim Keltsch
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { expect } from 'expect'
import './utils/env.test.js'
import { getAllCompanies, addCompany, getCompanyById, deleteCompanyById, putCompanyById } from '../services/companies.js'
import {sequelize} from '../models/index.js'
import { CompanyType } from '../models/companyTypes.js'

describe('Company Unit Tests', function () {
    this.timeout(5000)
    
    before(async function () {
        await sequelize.sync({ force: true })
        await CompanyType.bulkCreate([
            {
                name: 'Kunde'
            },
            {
                name: 'Lieferant'
            }
        ])
    })

    describe('test getAllCompanies / addCompany', function () {

        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllCompanies()).resolves.toHaveLength(0)
        })

        it('addCompany works with name and abbr and returns /companies/1', async function () {
            await expect(addCompany({ name: 'Firma A', abbr: 'FRA', www: 'www.firmaA.com', companyType: 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma A', 'abbr': 'FRA', 'www': 'www.firmaA.com', companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            )
        })

        it('addCompany works with name  and returns /companies/2', async function () {
            await expect(addCompany({ name: 'Firma B', companyType: 'Lieferant' })).resolves.toEqual(
                expect.objectContaining({ 'id': 2, 'name': 'Firma B', 'abbr': null, 'www': null, companyTypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            )
        })

        it('getAllCompanies returns 1 und 2', async function () {
            await expect(getAllCompanies()).resolves.toEqual([
                expect.objectContaining({ 'id': 1, 'name': 'Firma A', 'abbr': 'FRA', 'www': 'www.firmaA.com', companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                expect.objectContaining({ 'id': 2, 'name': 'Firma B', 'abbr': null, 'www': null, companyTypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
            ])
        })
    })

    describe('Test getCompanyById(id)', function () {

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRC', www: 'www.firmaA.com', companyTypeId: 1 }", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma A', 'abbr': 'FRA', 'www': 'www.firmaA.com', companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(2) returns {'id': 2, 'name': 'Firma B', 'abbr': null, www: null, CompanyTypeId: 2 }", async function () {
            await expect(getCompanyById(2)).resolves.toEqual(
                expect.objectContaining({ 'id': 2, 'name': 'Firma B', 'abbr': null, 'www': null, companyTypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it('getCompanyById(17) returns error', async function () {
            await expect(getCompanyById(17)).rejects.toEqual(
                expect.objectContaining({message: 'Not found: Company with id 17.'})
            )
        })
    })

    describe('Test putCompanyById(id)', function () {

        it("putCompanyById(1) change name to 'Firma C'", async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRA', companyType: 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': null, companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': null, companyTypeId: 1} after Name Change", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': 'FRA', 'www': null,
                        companyTypeId: 1,
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it("putCompanyById(1) adds www", async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRA', 'www': 'www.example.de', 'companyType': 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': 'www.example.de', companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': 'www.example.de', 'companyTypeId': 1} after www addition", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': 'FRA',
                        'www': 'www.example.de',
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) removes www', async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRA', 'companyType': 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': null, companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRA', 'www': null} after www removal", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr':
                            'FRA',
                        'www': null,
                        companyTypeId: 1,
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) remove abbr', async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'companyType': 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': null, 'www': null, companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': null, 'www': null, 'companyType': 'Kunde'} after abbr removal", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': null,
                        'www': null,
                        companyTypeId: 1,
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) add abbr', async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRC', 'companyType': 'Kunde' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': 'FRC', 'www': null, companyTypeId: 1, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRC', 'companyType': 'Kunde'} after abbr addition", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': 'FRC',
                        'www': null,
                        companyTypeId: 1,
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) remove name returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required name prop
            await expect(putCompanyById(1, { 'abbr': 'FRA', 'companyType': 'Kunde' })).rejects.toEqual(
                expect.objectContaining({message: 'Bad request.'})
            )
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRC, 'www': null, 'companyType': 'Kunde'} after unsuccessful name removal", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': 'FRC',
                        'www': null,
                        companyTypeId: 1,
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(17) returns error', async function () {
            await expect(putCompanyById(17, { 'name': 'Firma D', 'abbr': 'FRD', 'companyType': 'Kunde' })).rejects.toEqual(
                expect.objectContaining({message: 'Not found: company 17.'})
            )
        })

        it('putCompanyById(1) remove companyType returns error', async function () {
            // @ts-expect-error Provoke error by giving company without required company type
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRC' })).rejects.toEqual(
                expect.objectContaining({message: 'Bad request.'})
            )
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRC, 'www': null, 'companyType': 'Kunde'} after unsuccessful company type removal", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name':
                            'Firma C',
                        'abbr': 'FRC',
                        'www': null,
                        companyTypeId: 1,
                        companyType: expect.objectContaining({ id: 1, name: 'Kunde', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })

        it('putCompanyById(1) successful change companyType', async function () {
            await expect(putCompanyById(1, { 'name': 'Firma C', 'abbr': 'FRC', 'companyType': 'Lieferant' })).resolves.toEqual(
                expect.objectContaining({ 'id': 1, 'name': 'Firma C', 'abbr': 'FRC', 'www': null, companyTypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) }))
        })

        it("getCompanyById(1) returns {'id': 1, 'name': 'Firma C', 'abbr': 'FRC, 'www': null, 'companyType': 'Lieferant'} after successful companyType change", async function () {
            await expect(getCompanyById(1)).resolves.toEqual(
                expect.objectContaining(
                    {
                        'id': 1,
                        'name': 'Firma C',
                        'abbr': 'FRC',
                        'www': null,
                        companyTypeId: 2,
                        companyType: expect.objectContaining({ id: 2, name: 'Lieferant', createdAt: expect.any(Date), updatedAt: expect.any(Date) }),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    }))
        })
    })

    describe('Test DeleteCompanyById', function () {

        it('deleteCompanyById resolves', async function () {
            await expect(deleteCompanyById(1)).resolves.toBeUndefined()
        })

        it('subsequent deleteCompanyById(1) resolves to Error', async function () {
            await expect(deleteCompanyById(1)).rejects.toEqual(
                expect.objectContaining({message: 'Not found: Company with id 1.'})
            )
        })

        it('getAllCompanies returns only 2', async function () {
            await expect(getAllCompanies()).resolves.toEqual(
                [expect.objectContaining({ 'id': 2, 'name': 'Firma B', 'abbr': null, 'www': null, companyTypeId: 2, createdAt: expect.any(Date), updatedAt: expect.any(Date) })
                ])
        })
    })
})