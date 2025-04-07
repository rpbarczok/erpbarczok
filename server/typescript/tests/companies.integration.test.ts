/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './utils/env.test.js'
import request from 'supertest'
import { startingApp } from '../app.js'
import { sequelize } from '../models/index.js'
import { expect } from 'expect'
import { App } from 'supertest/types.js'
import { CompanyType } from '../models/companyTypes.js'
import { sha256 } from '../hasher.js'
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

const companyA = { 'name': 'Firma A', 'companyType': 'Kunde', 'abbr': 'FRA', 'www': 'www.firmaA.com', }
const etagA = sha256(JSON.stringify(companyA))
const companyB = { 'name': 'Firma B', 'companyType': 'Lieferant' }
const etagB = sha256(JSON.stringify(companyB))
const companyBA = { 'name': 'Firma C', 'companyType': 'Lieferant' }
const etagBA = sha256(JSON.stringify(companyBA))
const companyBA2 = { 'name': 'Firma C', 'companyType': 'Lieferant', 'abbr': 'FRC' }
const etagBA2 = sha256(JSON.stringify(companyBA2))
const companyBA3 = { 'name': 'Firma C', 'companyType': 'Lieferant', 'abbr': 'FRC', 'www': 'www.example.de' }
const etagBA3 = sha256(JSON.stringify(companyBA3))
const companyBA4 = { 'name': 'Firma C', 'companyType': 'Kunde', 'abbr': 'FRC', 'www': 'www.example.de' }
const etagBA4 = sha256(JSON.stringify(companyBA4))

describe('/companies/ HTTP integration Tests', function () {
    this.timeout(5000)
    let app: App

    before(async function () {
        app = await startingApp
        await sequelize.sync({ force: true })
        await CompanyType.bulkCreate([
            {
                name: 'Kunde'
            },
            {
                name: 'Lieferant'
            }
        ])
    });

    describe('GET /companies/ and POST /companies/', function () {

        it('GET /companies/ should fail with 401 without AuthN', async function () {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(401)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toMatch('No authorization token was found')
        })

        it('GET /companies/ should succeed with 200 and return [] for a fresh and empty DB as Guest', async function () {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /companies/ should succeed with 200 and return [] for a fresh and empty DB as User', async function () {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('GET /companies/ should succeed with 200 and return [] for a fresh and empty DB as Admin', async function () {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('content-type', /json/)
                .expect(200, [])
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.status).toEqual(200)
            expect(response.body).toEqual([])
        })

        it('Post /companies/ with name, companyType and abbr fails as Guest', async function () {
            const response = await request(app)
                .post('/companies/')
                .send(companyA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect(401)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toMatch('unauthorized')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with name, companyType and abbr fails with expired token', async function () {
            const response = await request(app)
                .post('/companies/')
                .send(companyA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(401)
            expect(response.status).toEqual(401)
            expect(response.body.status).toEqual(401)
            expect(response.body.message).toMatch('jwt expired')
        })

        it('Post /company/ with name, companyType and abbr succeeds as User', async function () {
            await request(app)
                .post('/companies/')
                .send(companyA)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect(204, '')
                .expect('location', '/companies/1')
                .expect('etag', etagA)
        })

        it('Post /company/ with name only succeeds', async function () {
            await request(app)
                .post('/companies/')
                .send(companyB)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect(204, '')
                .expect('location', '/companies/2')
        })

        it('Post /company/ without name fails', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'abbr': 'FRC' })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with to long abbr fails', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'name': 'Firma D', 'abbr': 'Firma', 'companyType': 'Kunde' })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/request\/body\/abbr must NOT have more than 3 characters/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with extra attributes fails', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'name': 'Firma D', 'abbr': 'FRD', 'extra': 'bla', 'companyType': 'Kunde' })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must NOT have additional properties/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with invalid name type fails (array)', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'name': {}, 'companyType': 'Kunde' })
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with invalid abbr type fails (array)', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'name': 'Firma E', 'abbr': {}, 'companyType': 'Kunde' })
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('Post /companies/ with invalid www type fails (array)', async function () {
            const response = await request(app)
                .post('/companies/')
                .send({ 'name': 'Firma E', 'www': {}, 'companyType': 'Kunde' })
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch(/must be string/)
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })

    describe('GET /companies/{id}', function () {

        it('GET /companies/{id} fails without authN', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch('No authorization token was found')
        })

        it('GET /companies/{id} existing company succeeds as Guest', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers.location).toBe('/companies/2')
            expect(response.headers.etag).toBe(etagB)
        })

        it('GET /companies/{id} existing company succeeds as User', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers.location).toBe('/companies/2')
            expect(response.headers.etag).toBe(etagB)
        })

        it('GET /companies/{id} existing company succeeds as Admin', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers.location).toBe('/companies/2')
            expect(response.headers.etag).toBe(etagB)
        })

        it('GET /companies/{id} non existing company fails', async function () {
            const response = await request(app)
                .get('/companies/17')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe('not found')
        })

        it('GET /companies/{id} with negative id fails', async function () {
            const response = await request(app)
                .get('/companies/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
        })

        it('GET /companies/{id} with strange id fails', async function () {
            const response = await request(app)
                .get('/companies/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be integer')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /companies/ works with contents', async function () {
            const response = await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                [
                    { 'meta': { 'location': '/companies/1', 'etag': etagA }, data: companyA },
                    { 'meta': { 'location': '/companies/2', 'etag': etagB }, data: companyB }
                ])
        })

        it('GET /api-docs works', async function () {
            await request(app)
                .get('/api-docs')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
        })

        it('GET /docs/ works', async function () {
            await request(app)
                .get('/docs/')
                .set('Accept', 'text/html')
                .expect('Content-Type', new RegExp('text/html'))
                .expect(200, new RegExp('<title>Swagger UI</title>'))
        })

        it('GET /something fails', async function () {
            await request(app)
                .get('/something')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(404, { status: 404, message: 'not found', errors: [] })
        })
    })

    describe('PUT /companies/{id}', function () {

        it('GET /companies/{id} existing company succeeds', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyB)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagB)
        })

        it('PUT /companies/{id} to change name of existing company unsuccessful for guest', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .set('if-match', etagB)
                .send(companyBA)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch('unauthorized')
        })

        it('PUT /companies/{id} to change name of existing company successful for user', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagB)
                .send(companyBA)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA)
        })

        it('GET /companies/{id} existing company succeeds after Name Change', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA)
        })

        it('PUT /companies/{id}: add abbr to existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA)
                .send(companyBA2)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA2)
        })

        it('GET /companies/{id} existing company succeeds after abbr added.', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA2)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA2)
        })

        it('PUT /companies/{id}: add www to existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA2)
                .send(companyBA3)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA3)
        })

        it('GET /companies/{id} existing company succeeds after www added.', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA3)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA3)
        })

        it('PUT /companies/{id}: change companyType from existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA3)
                .send(companyBA4)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA4)
        })

        it('GET /companies/{id} existing company succeeds after companyType changed.', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA4)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA4)
        })


        it('PUT /companies/{id}: change companyType back from existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA4)
                .send(companyBA3)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA3)
        })

        it('PUT /companies/{id}: remove www from existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA3)
                .send(companyBA2)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA2)
        })

        it('GET /companies/{id} existing company succeeds after www removed', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA2)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA2)
        })

        it('PUT /companies/{id}: remove abbr from existing company succeeds', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA2)
                .send(companyBA)
                .expect(204, '')
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA)

        })

        it('GET /companies/{id} existing company succeeds after abbr removed', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA)
        })

        it('PUT /companies/{id} on changed dataset fails with error 412', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA3)
                .send(companyBA2)
                .expect(412)
            expect(response.body.status).toBe(412)
            expect(response.body.message).toMatch('Precondition failed')
        })

        it('PUT /companies/{id}: remove name form existing company fails', async function () {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .set('if-match', etagBA)
                .send({})
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch("request/body must have required property 'name'")
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('GET /companies/{id} existing company succeeds after name removal failed', async function () {
            const response = await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect('Content-Type', /json/)
                .expect(200, companyBA)
            expect(response.headers.location).toEqual('/companies/2')
            expect(response.headers.etag).toEqual(etagBA)
        })
    })

    describe('DELETE /companies/{id}', function () {

        it('DELETE /company-types/{id} with existing company fails when no etag', async function (): Promise<void> {
            const response = await request(app)
                .delete('/company-types/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenAdmin}`)
                .expect(409)
            expect(response.body.status).toBe(409)
            expect(response.body.message).toMatch('Conflict')
        })

        it('DELETE /companies/{id} existing company fails as guest', async function () {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenGuest}`)
                .expect(401)
            expect(response.body.status).toBe(401)
            expect(response.body.message).toMatch('unauthorized')
        })

        it('DELETE /companies/{id} existing company succeeds', async function () {
            await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect(204, '')
        })

        it('DELETE /companies/{id} nonexisting item fails', async function () {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(404)
            expect(response.body.status).toBe(404)
            expect(response.body.message).toBe('not found')
        })

        it('DELETE /companies/{id} with negative id fails', async function () {
            const response = await request(app)
                .delete('/companies/-1')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /companies/{id} with id 0 fails', async function () {
            const response = await request(app)
                .delete('/companies/0')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be >= 1')
            expect(response.body.errors).toBeInstanceOf(Array)
        })

        it('DELETE /companies/{id} with strange id fails', async function () {
            const response = await request(app)
                .delete('/companies/foo')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validTokenUser}`)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body.status).toBe(400)
            expect(response.body.message).toMatch('must be integer')
            expect(response.body.errors).toBeInstanceOf(Array)
        })
    })
})