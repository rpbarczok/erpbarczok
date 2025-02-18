import request from 'supertest'
import './utils/testenv.js'
import { startingApp } from '../app.js'
import { sequelize } from '../models/index.js'
import { expect } from 'expect'
import { App } from 'supertest/types.js'
import { sha256 } from '../hasher.js'


const companytypeA = { "name": "Kunde" }
const companytypeB = { "name": "Spediteur" }
const companytypeC = { "name": "Lieferant" }
const etagA = sha256(JSON.stringify(companytypeA))
const etagB = sha256(JSON.stringify(companytypeB))
const etagC = sha256(JSON.stringify(companytypeC))

describe('/companytypes/ HTTP integration Tests', async function () {
    this.timeout(5000)
    let app: App

    before(async function () {
        app = await startingApp
        await sequelize.sync({ force: true })
    });

    describe('GET /companytypes/ and POST /companytypes/', async function () {

        it('should succeed with 200 and return [] for a fresh and empty DB', async () => {
            const response = await request(app)
                .get('/companytypes/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('Post /companytypes with name', async () => {
            const response = await request(app)
                .post('/companytypes/')
                .send(companytypeA)
                .set('Accept', "application/json")
                .expect(201, '')
                .expect("location", "/companytypes/1")
            expect(response.headers["location"]).toEqual("/companytypes/1")
            expect(response.headers["etag"]).toEqual(sha256(JSON.stringify(companytypeA)))
        })

        it('Post /companytypes with name', async () => {
            const response = await request(app)
                .post('/companytypes/')
                .send(companytypeB)
                .set('Accept', "application/json")
                .expect(201, '')
                .expect("location", "/companytypes/2")
            expect(response.headers["location"]).toEqual("/companytypes/2")
            expect(response.headers["etag"]).toEqual(sha256(JSON.stringify(companytypeB)))
        })

        it('Post /companytypes without name fails', async () => {
            const response = await request(app)
                .post('/companytypes/')
                .send({})
                .set('Accept', "application/json")
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a companytype with extra attributes fails', async () => {
            const response = await request(app)
                .post('/companytypes/')
                .send({ "name": "Sonstiges", "extra": "bla" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must NOT have additional properties/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Add a companytype with invalid name type fails (array)', async () => {
            const response = await request(app)
                .post('/companytypes/')
                .send({ "name": {} })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /companytypes/ works with contents', async () => {
            const response = await request(app)
                .get('/companytypes/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                [
                    { "meta": { "location": "/companytypes/1", "etag": etagA }, "data": companytypeA },
                    { "meta": { "location": "/companytypes/2", "etag": etagB }, "data": companytypeB }
                ])
        })
    })

    describe('GET /companytypes/{id}', async function () {

        it('Get existing companytype succeeds', async () => {
            const response = await request(app)
                .get('/companytypes/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companytypeB)
            expect(response.headers['location']).toEqual("/companytypes/2")
            expect(response.headers['etag']).toEqual(etagB)
        })

        it('Get non existing companytype fails', async () => {
            const response = await request(app)
                .get('/companytypes/17')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('Get companytype with negative id fails', async () => {
            const response = await request(app)
                .get('/companytypes/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeNull
        })

        it('Get companytype with strange id fails', async () => {
            const response = await request(app)
                .get('/companytypes/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be integer")
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })

    describe('PUT /companytypes/{id}', async function () {

        it('Get existing companytype succeeds', async () => {
            const response = await request(app)
                .get('/companytypes/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companytypeB)
            expect(response.headers["location"]).toEqual("/companytypes/2")
            expect(response.headers["etag"]).toEqual(etagB)
        })

        it('Change name of existing companytype', async () => {
            const response = await request(app)
                .put('/companytypes/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagB)
                .send(companytypeC)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/companytypes/2')
            expect(response.headers['etag']).toEqual(etagC)
        })

        it('Get existing companytype succeeds after Name Change', async () => {
            const response = await request(app)
                .get('/companytypes/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, companytypeC)
            expect(response.headers['location']).toBe('/companytypes/2')
            expect(response.headers['etag']).toBe(etagC)
        })

        it('Put companytypes on changed dataset fails with error 412', async () => {
            const response = await request(app)
                .put('/companytypes/2')
                .set('Accept', 'application/json')
                .set('location', '/companytypes/2')
                .set('if-match', etagA)
                .send(companytypeC)
                .expect(412)
            expect(response.body.status).toBe(412)
            expect(response.body.message).toMatch("Precondition failed")
        })
    })

    describe('DELETE /companytypes/{id}', function () {
        it('Deleting existing companytypes succeeds', async () => {
            const response = await request(app)
                .delete('/companytypes/1')
                .set('Accept', 'application/json')
                .expect(204, '')
        })

        it('Deleting nonexisting companytype fails', async () => {
            const response = await request(app)
                .delete('/companytypes/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('Deleting companytype with negative id fails', async () => {
            const response = await request(app)
                .delete('/companytypes/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Deleting companytype with id 0 fails', async () => {
            const response = await request(app)
                .delete('/companytypes/0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Deleting companytype strange id fails', async () => {
            const response = await request(app)
                .delete('/companytypes/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be integer")
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })
})

after(async function () {
    await sequelize.close()
});