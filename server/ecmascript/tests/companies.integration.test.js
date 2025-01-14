import request from 'supertest';
import startingApp from '../app.js';
import sequelize from '../models/index.js';
import { expect } from 'expect';
describe('/companies/ HTTP integration Tests', function () {
    let app;
    before(async function () {
        app = await startingApp;
        await sequelize.sync({ force: true });
    });
    describe('GET /companies/ and POST /companies/', function () {
        it('should succeed with 200 and return [] for a fresh and empty DB', async () => {
            await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .expect('content-type', /json/)
                .expect(200, []);
        });
        it('Post /company with name and abbr succeeds', async () => {
            await request(app)
                .post('/companies/')
                .send({ "name": "Firma A", "abbr": "FRA", "www": "www.firmaa.com" })
                .set('Accept', "application/json")
                .expect(201, '')
                .expect("location", "/companies/1");
        });
        it('Post /company with name only succeeds', async () => {
            await request(app)
                .post('/companies/')
                .send({ "name": "Firma B" })
                .set('Accept', "application/json")
                .expect(201, '')
                .expect('location', '/companies/2');
        });
        it('Post /company without name fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "abbr": "FRC" })
                .set('Accept', "application/json")
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.message).toMatch(/request\/body must have required property 'name'/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Add company with to long abbr fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma D", "abbr": "Firma" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch(/request\/body\/abbr must NOT have more than 3 characters/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Add a company with extra attributes fails', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma D", "abbr": "FRD", "extra": "bla" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch(/must NOT have additional properties/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Add a company with invalid name type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": {} })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch(/must be string/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Add a company with invalid abbr type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma E", "abbr": {} })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch(/must be string/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Add a company with invalid www type fails (array)', async () => {
            const response = await request(app)
                .post('/companies/')
                .send({ "name": "Firma E", "www": {} })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch(/must be string/);
            expect(response.body.errors).toBeInstanceOf(Array);
        });
    });
    describe('GET /companies/{id}', function () {
        it('Get existing company succeeds', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { name: 'Firma B' } });
        });
        it('Get non existing company fails', async () => {
            const response = await request(app)
                .get('/companies/17')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.status).toBe(404);
            expect(response.body.message).toBe("not found");
            expect(response.body.errors).toBeNull;
        });
        it('Get with negative id fails', async () => {
            const response = await request(app)
                .get('/companies/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must be >= 1");
            expect(response.body.errors).toBeNull;
        });
        it('Get with strange id fails', async () => {
            const response = await request(app)
                .get('/companies/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must be integer");
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('GET /companies/ works with contents', async () => {
            await request(app)
                .get('/companies/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, [{ location: '/companies/1', company: { name: 'Firma A', abbr: 'FRA' } }, { location: '/companies/2', company: { name: 'Firma B' } }]);
        });
        it('GET /api-docs works', async () => {
            await request(app)
                .get('/api-docs')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
        it('GET /docs/ works', async () => {
            await request(app)
                .get('/docs/')
                .set('Accept', 'text/html')
                .expect('Content-Type', new RegExp("text/html"))
                .expect(200, new RegExp("<title>Swagger UI</title>"));
        });
        it('GET /something fails', async () => {
            await request(app)
                .get('/something')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, { status: 404, message: "not found", errors: [{ path: "/something", message: "not found" }] });
        });
    });
    describe('PUT /companies/{id}', function () {
        it('Get existing company succeeds', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma B' } });
        });
        it('Change name of existing company', async () => {
            await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "name": "Firma C" })
                .expect(204, '');
        });
        it('Get existing company succeeds after Name Change', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C' } });
        });
        it('PUT: add abbr to existing company succeeds', async () => {
            await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "name": "Firma C", "abbr": "FRC" })
                .expect(204, '');
        });
        it('Get existing company succeeds after abbr added.', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C', "abbr": 'FRC' } });
        });
        it('PUT: add www to existing company succeeds', async () => {
            await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "name": "Firma C", "abbr": "FRC", "www": "www.example.de" })
                .expect(204, '');
        });
        it('Get existing company succeeds after www added.', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C', "abbr": 'FRC', "www": "www.example.de" } });
        });
        it('PUT: remove www from existing company succeeds', async () => {
            await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "name": "Firma C", "abbr": "FRC" })
                .expect(204, '');
        });
        it('Get existing company succeeds after www removed', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C', "abbr": "FRC" } });
        });
        it('PUT: remove abbr from existing company succeeds', async () => {
            await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "name": "Firma C" })
                .expect(204, '');
        });
        it('Get existing companny succeeds after abbr removed', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C' } });
        });
        it('PUT: remove name form existing company fails', async () => {
            const response = await request(app)
                .put('/companies/2')
                .set('Accept', 'application/json')
                .send({ "location": "/companies/2", "company": {} })
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must have required property 'name'");
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Get existing company succeeds after name removal faild', async () => {
            await request(app)
                .get('/companies/2')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, { "location": "/companies/2", "company": { "name": 'Firma C' } });
        });
    });
    describe('DELETE /companies/{id}', function () {
        it('Deleting existing company succeeds', async () => {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .expect(204, '');
        });
        it('Deleting nonexisting item fails', async () => {
            const response = await request(app)
                .delete('/companies/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body.status).toBe(404);
            expect(response.body.message).toBe("not found");
            expect(response.body.errors).toBeNull;
        });
        it('Deleting item with negative id fails', async () => {
            const response = await request(app)
                .delete('/companies/-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must be >= 1");
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Deleting item with id 0 fails', async () => {
            const response = await request(app)
                .delete('/companies/0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must be >= 1");
            expect(response.body.errors).toBeInstanceOf(Array);
        });
        it('Deleting strange id fails', async () => {
            const response = await request(app)
                .delete('/companies/foo')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message).toMatch("must be integer");
            expect(response.body.errors).toBeInstanceOf(Array);
        });
    });
});
