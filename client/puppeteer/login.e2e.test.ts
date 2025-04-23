import puppeteer from 'puppeteer'
import { getDocument, queries } from 'pptr-testing-library'
import { expect } from 'expect'

const browser = await puppeteer.launch()
const page = await browser.newPage()

describe('start functions', function () {

    before(async function () {
        await page.setViewport({ width: 1920, height: 1080 })
    })

    after(async function () { await browser.close() })

    it('logins', async function () {
        this.timeout(10000)
        console.log(0)
        await page.goto('http://localhost:3000')
        console.log(1)
        const $document = await getDocument(page)
        console.log(2)
        const $login = await queries.getByText($document, "Login")
        console.log(3)
        expect($login).not.toBeNull()
        console.log(4)
        await $login.click()
    })
})