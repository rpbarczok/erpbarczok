/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './utils/env.test.js'
import request from 'supertest'
import { startingApp } from '../app.js'
import { sequelize } from '../models/index.js'
import { expect } from 'expect'
import { App } from 'supertest/types.js'
import { sha256 } from './utils/hasher.js'
import jwt from 'jsonwebtoken'

const iat = Math.floor(Date.now() / 1000)
const iatADayAgo = iat - 60 * 60 * 24
const iatAWeekAgo = iat - 8 * 60 * 60 * 24

const audience = process.env.AUDIENCE ?? 'www.example.com'
const issuer = process.env.IDP_SERVER ?? 'www.example.com'
const scope = process.env.SCOPE ?? 'openid email profile admin user'
const secret = process.env.TEST_SECRET ?? 'secret'
const algorithms = ['HS256']

const validTokenAdmin: string = jwt.sign(
    {
        'iss': issuer,
        'aud': audience,
        'iat': iat,
        'scope': scope,
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const validTokenGuest: string = jwt.sign(
    {
        'iss': issuer,
        'aud': audience,
        'iat': iat,
        'scope': 'openid email',
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const validTokenUser: string = jwt.sign(
    {
        'iss': issuer,
        'aud': audience,
        'iat': iat,
        'scope': 'openid email user',
        'expiresIn': '1h',
        'alg': algorithms[0],
    },
    secret
)

const expiredToken: string = jwt.sign(
    {
        'iss': issuer,
        'aud': audience,
        'iat': iatAWeekAgo,
        'scope': scope,
        'alg': algorithms[0],
        'exp': iatADayAgo
    },
    secret
)

const countryA = { 'name': 'Austria', abbr: 'AUT', isEU: true }
const countryB = { 'name': 'China', abbr: 'CHN', isEU: false }
const countryC = { 'name': 'Germany', abbr: 'DEU', isEU: true }
const countryWN = { abbr: 'son', isEU: false }
const countryWA = { 'name': 'Sonstiges', isEU: false }
const countryWEU = { 'name': 'Sonstiges', abbr: 'son' }
const etagA = sha256(JSON.stringify(countryA))
const etagB = sha256(JSON.stringify(countryB))
const etagC = sha256(JSON.stringify(countryC))

describe('/countries/ HTTP integration Tests', function () {
    this.timeout(5000)
    let app: App

    before(async function () {
        app = await startingApp
        await sequelize.sync({ force: true })
    });

    describe('GET /countries/ and POST /countries/', function () {

        it('GET /countries/ should fail with 401 for missing AuthN', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(401)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual('No authorization token was found')
        })

        it('GET /countries/ should fail with 401 for expired AuthN', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect('content-type', /json/)
                .expect(401)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual('jwt expired')
        })

        it('GET /countries/ should succeed with 200 and return [] for a fresh and empty DB as Guest', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /countries/ should succeed with 200 and return [] for a fresh and empty DB as User', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /countries/ should succeed with 200 and return [] for a fresh and empty DB as Admin', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('post /countries with name should fail with 401 because of missing authZ ', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect(401)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toEqual('unauthorized')
        })

        it('post /countries with all information should succeed for Admin', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(201, '')
            expect(response.headers.location).toEqual('/countries/1')
            expect(response.headers.etag).toEqual(sha256(JSON.stringify(countryA)))
        })

        it('Post /countries with all information', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryB)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(201, '')
                .expect('location', '/countries/2')
            expect(response.headers.location).toEqual('/countries/2')
            expect(response.headers.etag).toEqual(sha256(JSON.stringify(countryB)))
        })

        it('Post /countries without name fails', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryWN)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /countries without abbr fails', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryWA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'abbr'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /countries without EU fails', async function () {
            const response = await request(app)
                .post('/countries/')
                .send(countryWEU)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'isEU'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /countries with extra attributes fails', async function () {
            const response = await request(app)
                .post('/countries/')
                .send({ ...countryA, sonstiges: 'bla' })
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must NOT have additional properties/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /countries with invalid name type fails (array)', async function () {
            const response = await request(app)
                .post('/countries/')
                .send({ ...countryA, 'name': {} })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /countries/ works with contents', async function () {
            const response = await request(app)
                .get('/countries/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                [
                    { 'meta': { 'location': '/countries/1', 'etag': etagA }, 'data': countryA },
                    { 'meta': { 'location': '/countries/2', 'etag': etagB }, 'data': countryB }
                ])
        })
    })

    describe('GET /countries/{id}', function () {

        it('Get /countries/{id} succeeds when existing', async function () {
            const response = await request(app)
                .get('/countries/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, countryB)
            expect(response.headers.location).toEqual('/countries/2')
            expect(response.headers.etag).toEqual(etagB)
        })

        it('Get /countries/{id} fails with 404 when not existing', async function () {
            const response = await request(app)
                .get('/countries/17')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe('Not found: Country with id 17.')
        })

        it('Get /countries/{id} fails with 400 with negative id fails', async function () {
            const response = await request(app)
                .get('/countries/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
        })

        it('Get /countries/{id} fails with 400 with strange id', async function () {
            const response = await request(app)
                .get('/countries/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be integer')
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })

    describe('PUT /countries/{id}', function () {

        it('Get /countries/{id} existing country succeeds', async function () {
            const response = await request(app)
                .get('/countries/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, countryB)
            expect(response.headers.location).toEqual('/countries/2')
            expect(response.headers.etag).toEqual(etagB)
        })

        it('Put /countries/{id} of existing country fails with 401 with Guest ', async function () {
            const response = await request(app)
                .put('/countries/2')
                .set('Accept', 'application/json')
                .set('location', '/countries/2')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .set('if-match', etagB)
                .send(countryC)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch('unauthorized')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Put /countries/{id} of existing country fails with 401 with User ', async function () {
            const response = await request(app)
                .put('/countries/2')
                .set('Accept', 'application/json')
                .set('location', '/countries/2')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagB)
                .send(countryC)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch('unauthorized')
            expect(response.body.errors).toBeInstanceOf(Array)
        })


        it('Put /countries/{id} of existing country succeeds with correct name, abbr and EU change with Admin', async function () {
            const response = await request(app)
                .put('/countries/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('location', '/countries/2')
                .set('if-match', etagB)
                .send(countryC)
                .expect(204, '')
            expect(response.headers.location).toEqual('/countries/2')
            expect(response.headers.etag).toEqual(etagC)
        })

        it('Get /countries/{id} succeeds after change of all attributes', async function () {
            const response = await request(app)
                .get('/countries/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, countryC)
            expect(response.headers.location).toBe('/countries/2')
            expect(response.headers.etag).toBe(etagC)
        })

        it('Put /countries/{id} on changed dataset fails with error 412', async function () {
            const response = await request(app)
                .put('/countries/2')
                .set('Accept', 'application/json')
                .set('location', '/countries/2')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .set('if-match', etagA)
                .send(countryC)
                .expect(412)
            expect(response.body.status).toBe(412)
            expect(response.body.message).toMatch('Precondition failed.')
        })
    })

    describe('DELETE /countries/{id}', function () {

        it('DELETE /countries/{id} existing countries fails with 401 as Guest', async function () {
            const response = await request(app)
                .delete('/countries/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toBe('unauthorized')
        })

        it('DELETE /countries/{id} existing countries fails with 401 as User', async function () {
            const response = await request(app)
                .delete('/countries/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toBe('unauthorized')
        })

        it('DELETE /countries/{id} existing countries succeeds as Admin', async function () {
            await request(app)
                .delete('/countries/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(204, '')
        })

        it('DELETE /countries/{id} fails with 404 with nonexisting country', async function () {
            const response = await request(app)
                .delete('/countries/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe('Not found: Country with id 1.')
        })

        it('DELETE /countries/{id} fails with 400 with negative id', async function () {
            const response = await request(app)
                .delete('/countries/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /countries/{id} fails with 400 with id 0', async function () {
            const response = await request(app)
                .delete('/countries/0')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /countries/{id} fails with 400 with strange id', async function () {
            const response = await request(app)
                .delete('/countries/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be integer')
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })
})
