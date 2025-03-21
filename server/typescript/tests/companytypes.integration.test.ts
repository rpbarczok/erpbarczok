import './utils/env.test.js'
import request from 'supertest'
import { startingApp } from '../app.js'
import { sequelize } from '../models/index.js'
import { expect } from 'expect'
import { App } from 'supertest/types.js'
import { sha256 } from '../hasher.js'
import { jwtCheck } from '../utils/auth.js'
import jwt from 'jsonwebtoken'

const iat = Math.floor(Date.now() / 1000)
const iatADayAgo = iat - 60 * 60 * 24
const iatAWeekAgo = iat - 8 * 60 * 60 * 24

const audience = process.env.AUDIENCE || 'www.example.com'
const issuer = process.env.IDP_SERVER || 'www.example.com'
const scope = process.env.SCOPE || 'openid email profile admin user'
const secret = process.env.TEST_SECRET || 'secret'
const algorithms = process.env.ALGORITHM_TEST?.split(' ') || ['HS256']

//@ts-ignore
const validTokenAdmin: string = jwt.sign(
    {
        "iss": issuer,
        "aud": audience,
        "iat": iat,
        'scope': scope,
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const validTokenGuest: string = jwt.sign(
    {
        "iss": issuer,
        "aud": audience,
        "iat": iat,
        'scope': 'openid email',
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const validTokenUser: string = jwt.sign(
    {
        "iss": issuer,
        "aud": audience,
        "iat": iat,
        'scope': 'openid email user',
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const expiredToken: string = jwt.sign(
    {
        "iss": issuer,
        "aud": audience,
        "iat": iatAWeekAgo,
        'scope': scope,
        'alg': algorithms[0],
        'exp': iatADayAgo
    },
    secret
)

const companyTypeA = { "name": "Kunde" }
const companyTypeB = { "name": "Spediteur" }
const companyTypeC = { "name": "Lieferant" }
const etagA = sha256(JSON.stringify(companyTypeA))
const etagB = sha256(JSON.stringify(companyTypeB))
const etagC = sha256(JSON.stringify(companyTypeC))

describe('/company-types/ HTTP integration Tests', async function () {
    this.timeout(5000)
    let app: App

    before(async function () {
        app = await startingApp
        await sequelize.sync({ force: true })
    });

    describe('GET /company-types/ and POST /company-types/', async function () {

        it('GET /company-types/ should fail with 401 for missing AuthN', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(401)
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual("No authorization token was found")
        })

        it('GET /company-types/ should fail with 401 for expired AuthN', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect('content-type', /json/)
                .expect(401)
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual("jwt expired")
        })

        it('GET /company-types/ should succeed with 200 and return [] for a fresh and empty DB as Guest', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /company-types/ should succeed with 200 and return [] for a fresh and empty DB as User', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /company-types/ should succeed with 200 and return [] for a fresh and empty DB as Admin', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('post /company-types with name should fail with 401 because of missing authZ ', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send(companyTypeA)
                .set('Accept', "application/json")
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect(401)
            expect(response.headers["content-type"]).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual("unauthorized")
        })

        it('post /company-types with name should fail with 401 because of missing authZ ', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send(companyTypeA)
                .set('Accept', "application/json")
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(201, '')
            expect(response.headers["location"]).toEqual("/company-types/1")
            expect(response.headers["etag"]).toEqual(sha256(JSON.stringify(companyTypeA)))
        })

        it('Post /company-types with name', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send(companyTypeB)
                .set('Accept', "application/json")
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(201, '')
                .expect("location", "/company-types/2")
            expect(response.headers["location"]).toEqual("/company-types/2")
            expect(response.headers["etag"]).toEqual(sha256(JSON.stringify(companyTypeB)))
        })

        it('Post /company-types without name fails', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send({})
                .set('Accept', "application/json")
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /company-types with extra attributes fails', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send({ "name": "Sonstiges", "extra": "bla" })
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must NOT have additional properties/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /company-types with invalid name type fails (array)', async () => {
            const response = await request(app)
                .post('/company-types/')
                .send({ "name": {} })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /company-types/ works with contents', async () => {
            const response = await request(app)
                .get('/company-types/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                [
                    { "meta": { "location": "/company-types/1", "etag": etagA }, "data": companyTypeA },
                    { "meta": { "location": "/company-types/2", "etag": etagB }, "data": companyTypeB }
                ])
        })
    })

    describe('GET /company-types/{id}', async function () {

        it('Get /company-type/{id} succeeds when existing', async () => {
            const response = await request(app)
                .get('/company-types/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyTypeB)
            expect(response.headers['location']).toEqual("/company-types/2")
            expect(response.headers['etag']).toEqual(etagB)
        })

        it('Get /company-type/{id} fails with 404 when not existing', async () => {
            const response = await request(app)
                .get('/company-types/17')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('Get /company-type/{id} fails with 400 with negative id fails', async () => {
            const response = await request(app)
                .get('/company-types/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeNull
        })

        it('Get /company-type/{id} fails with 400 with strange id', async () => {
            const response = await request(app)
                .get('/company-types/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be integer")
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })

    describe('PUT /company-types/{id}', async function () {

        it('Get /company-types/{id} existing company-type succeeds', async () => {
            const response = await request(app)
                .get('/company-types/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyTypeB)
            expect(response.headers["location"]).toEqual("/company-types/2")
            expect(response.headers["etag"]).toEqual(etagB)
        })

        it('Put /company-types/{id} of existing company-type fails with 401 with Guest ', async () => {
            const response = await request(app)
                .put('/company-types/2')
                .set('Accept', 'application/json')
                .set('location', '/company-types/2')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .set('if-match', etagB)
                .send(companyTypeC)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch("unauthorized")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Put /company-types/{id} of existing company-type fails with 401 with User ', async () => {
            const response = await request(app)
                .put('/company-types/2')
                .set('Accept', 'application/json')
                .set('location', '/company-types/2')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagB)
                .send(companyTypeC)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch("unauthorized")
            expect(response.body.errors).toBeInstanceOf(Array)
        })


        it('Put /company-types/{id} of existing company-type succeeds with correct name change with Admin', async () => {
            const response = await request(app)
                .put('/company-types/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('location', '/company-types/2')
                .set('if-match', etagB)
                .send(companyTypeC)
                .expect(204, '')
            expect(response.headers['location']).toEqual('/company-types/2')
            expect(response.headers['etag']).toEqual(etagC)
        })

        it('Get /company-types/{id} succeeds after Name Change', async () => {
            const response = await request(app)
                .get('/company-types/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyTypeC)
            expect(response.headers['location']).toBe('/company-types/2')
            expect(response.headers['etag']).toBe(etagC)
        })

        it('Put /company-types/{id} on changed dataset fails with error 412', async () => {
            const response = await request(app)
                .put('/company-types/2')
                .set('Accept', 'application/json')
                .set('location', '/company-types/2')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('if-match', etagA)
                .send(companyTypeC)
                .expect(412)
            expect(response.body.status).toBe(412)
            expect(response.body.message).toMatch("Precondition failed")
        })
    })

    describe('DELETE /company-types/{id}', function () {

        it('DELETE /company-types/{id} existing company-types fails with 401 as Guest', async () => {
            const response = await request(app)
                .delete('/company-types/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toBe("unauthorized")
            expect(response.body.errors).toBeNull
        })
        
        it('DELETE /company-types/{id} existing company-types fails with 401 as User', async () => {
            const response = await request(app)
                .delete('/company-types/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toBe("unauthorized")
            expect(response.body.errors).toBeNull
        })

        it('DELETE /company-types/{id} existing company-types succeeds as Admin', async () => {
            const response = await request(app)
                .delete('/company-types/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(204, '')
        })

        it('DELETE /company-types/{id} fails with 404 with nonexisting company-type', async () => {
            const response = await request(app)
                .delete('/company-types/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe("not found")
            expect(response.body.errors).toBeNull
        })

        it('DELETE /company-types/{id} fails with 400 with negative id', async () => {
            const response = await request(app)
                .delete('/company-types/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /company-types/{id} fails with 400 with id 0', async () => {
            const response = await request(app)
                .delete('/company-types/0')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("must be >= 1")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /company-types/{id} fails with 400 with strange id', async () => {
            const response = await request(app)
                .delete('/company-types/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
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