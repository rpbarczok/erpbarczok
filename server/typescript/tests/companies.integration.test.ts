import './utils/testenv.js'
import request from 'supertest'
import { startingApp } from '../app.js'
import { sequelize } from '../models/index.js'
import { expect } from 'expect'
import { App } from 'supertest/types.js'
import { Companytype } from '../models/companytypes.js'
import { sha256 } from '../hasher.js'


const companyA = { "name": "Firma A", "companytype": "Kunde", "abbr": "FRA", "www": "www.firmaa.com", }
const etagA = sha256(JSON.stringify(companyA))
const companyB = { "name": "Firma B", "companytype": "Lieferant" }
const etagB = sha256(JSON.stringify(companyB))
const companyBA = { "name": "Firma C", "companytype": "Lieferant" }
const etagBA = sha256(JSON.stringify(companyBA))
const companyBA2 = { "name": "Firma C", "companytype": "Lieferant", "abbr": "FRC" }
const etagBA2 = sha256(JSON.stringify(companyBA2))
const companyBA3 = { "name": "Firma C", "companytype": "Lieferant", "abbr": "FRC", "www": "www.example.de" }
const etagBA3 = sha256(JSON.stringify(companyBA3))
const companyBA4 = { "name": "Firma C", "companytype": "Kunde", "abbr": "FRC", "www": "www.example.de" }
const etagBA4 = sha256(JSON.stringify(companyBA4))

describe('/companies/ HTTP integration Tests', async function () {
    this.timeout(5000)
    let app: App

    before(async function () {
        app = await startingApp
        await sequelize.sync({ force: true })
        await Companytype.bulkCreate([
            {
                name: "Kunde"
            },
            {
                name: "Lieferant"
            }
        ])
    });

    describe('GET /companies/ and POST /companies/', async function () {

        it('should succeed with 200 and return [] for a fresh and empty DB', async () => {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('Post /company with name, companytype and abbr succeeds', async () => {
            const response = await request(app)
                .post('/companies/')
                .send(companyA)
                .set('Accept', "application/json")
                .expect(204, '')
                .expect("location", "/companies/1")
                .expect("etag", etagA)
        })

        it('Post /company with name only succeeds', async () => {
            const response = await request(app)
                .post('/companies/')
                .send(companyB)
                .set('Accept', "application/json")
                .expect(204, '')
                .expect('location', '/companies/2')
        })

        it('Post /company without name fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "abbr": "FRC" })
                .set('Accept', "application/json")
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add company with to long abbr fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma D", "abbr": "Firma", "companytype": "Kunde" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/request\/body\/abbr must NOT have more than 3 characters/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a company with extra attributes fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma D", "abbr": "FRD", "extra": "bla", "companytype": "Kunde" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must NOT have additional properties/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a company with invalid name type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": {}, "companytype": "Kunde" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a company with invalid abbr type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma E", "abbr": {}, "companytype": "Kunde" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a company with invalid www type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma E", "www": {}, "companytype": "Kunde" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })

    describe('GET /companies/{id}', async function () {

        it('Get existing company succeeds', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers['location']).toBe('/companies/2')
            expect(response.headers['etag']).toBe(etagB)
        })

        it('Get non existing company fails', async () => {
            const response = await request(app)
                .get('/companies/17')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('Get with negative id fails', async () => {
            const response = await request(app)
                .get('/companies/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeNull
        })

        it('Get with strange id fails', async () => {
            const response = await request(app)
                .get('/companies/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be integer")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /companies/ works with contents', async () => {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                [
                    { "meta": { "location": "/companies/1", "etag": etagA }, data: companyA },
                    { "meta": { "location": "/companies/2", "etag": etagB }, data: companyB }
                ])
        })

        it('GET /api-docs works', async () => {
            const response = await request(app)
                .get('/api-docs')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
        })

        it('GET /docs/ works', async () => {
            const response = await request(app)
                .get('/docs/')
                .set('Accept', 'text/html')
                .expect('Content-Type', new RegExp("text/html"))
                .expect(200, new RegExp("<title>Swagger UI</title>"))
        })

        it('GET /something fails', async () => {
            const response = await request(app)
                .get('/something')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, { status: 404, message: "not found", errors: [{ path: "/something", message: "not found" }] })
        })
    })

    describe('PUT /companies/{id}', async function () {

        it('Get existing company succeeds', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagB)
        })

        it('Change name of existing company', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagB)
                .send(companyBA)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA)
        })

        it('Get existing company succeeds after Name Change', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA)
        })

        it('PUT: add abbr to existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA)
                .send(companyBA2)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA2)
        })

        it('Get existing company succeeds after abbr added.', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA2)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA2)
        })

        it('PUT: add www to existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA2)
                .send(companyBA3)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA3)
        })

        it('Get existing company succeeds after www added.', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA3)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA3)
        })

        it('PUT: change companytype from existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA3)
                .send(companyBA4)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA4)
        })

        it('Get existing company succeeds after companytype changed.', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA4)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA4)
        })


        it('PUT: change companytype back from existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA4)
                .send(companyBA3)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA3)
        })

        it('PUT: remove www from existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA3)
                .send(companyBA2)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA2)
        })

        it('Get existing company succeeds after www removed', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA2)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA2)
        })

        it('PUT: remove abbr from existing company succeeds', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA2)
                .send(companyBA)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA)

        })

        it('Get existing company succeeds after abbr removed', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA)
        })

        it('Put company on changed dataset fails with error 412', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA3)
                .send(companyBA2)
                .expect(412)
            expect(response.body.status).toBe(412)
            expect(response.body.message).toMatch("Precondition failed")
        })

        it('PUT: remove name form existing company fails', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagBA)
                .send({})
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must have required property 'name'")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Get existing company succeeds after name removal failed', async () => {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers['location']).toEqual('/companies/2')
            expect(response.headers['etag']).toEqual(etagBA)
        })
    })

    describe('DELETE /companies/{id}', async function () {
        it('Deleting existing company succeeds', async () => {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .expect(204, '')
        })

        it('Deleting nonexisting item fails', async () => {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('Deleting item with negative id fails', async () => {
            const response = await request(app)
                .delete('/companies/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Deleting item with id 0 fails', async () => {
            const response = await request(app)
                .delete('/companies/0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Deleting strange id fails', async () => {
            const response = await request(app)
                .delete('/companies/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be integer")
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })
})