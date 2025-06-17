import puppeteer from 'puppeteer'
import { getDocument, queries } from 'pptr-testing-library'
import { expect } from 'expect'

const uri = 'http://localhost:3000/'
describe('config page', function () {

    it('displays config page', async function () {
        this.timeout(60000)
        // setup)
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(uri + 'config.js', { waitUntil: 'networkidle0' })
        const $document = await getDocument(page)
        const $config = await queries.getByText($document, "window.client_id = 'erpbarczok_app';", { exact: false })
        expect($config).not.toBeNull()
        await browser.close()
    })
})