import puppeteer from 'puppeteer'
import { getDocument, queries } from 'pptr-testing-library'
import { expect } from 'expect'

const browser = await puppeteer.launch()
const page = await browser.newPage()
const uri = window.location.href

describe('start functions', function () {

    before(async function () {
        await page.setViewport({ width: 1920, height: 1080 })
    })

    after(async function () { await browser.close() })

    it('login', async function () {
        this.timeout(10000)
        
        await page.goto(uri)
        const $document = await getDocument(page)
        const $login = await queries.getByText($document, "Login")

        expect($login).not.toBeNull()
        await $login.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
    })
})