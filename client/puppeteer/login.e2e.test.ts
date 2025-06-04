import puppeteer from 'puppeteer'
import { getDocument, queries } from 'pptr-testing-library'
import { expect } from 'expect'


describe('start functions', function () {

    const uri = 'http://localhost:3000/'

    let browser: puppeteer.Browser
    let $document: puppeteer.ElementHandle
    let page: puppeteer.Page

    before(async function () {
        browser = await puppeteer.launch()
    })

    after(async function () { await browser.close() })

    beforeEach(async function () {
        page = await browser.newPage()
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(uri)


        $document = await getDocument(page)
    })

    this.timeout(6_000)

    it('login', async function () {
        this.timeout(10000)

        // login page 
        const $login = await queries.getByText($document, "Login")
        expect($login).not.toBeNull()
        await $login.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })

        // keycloak sing in
        $document = await getDocument(page)
        const $keycloakTitle = await queries.getByText($document, 'erpbarczok')
        expect($keycloakTitle).not.toBeNull()

        const $inputUserName = await queries.getByLabelText($document, 'Username or email')
        expect($inputUserName).not.toBeNull()
        await $inputUserName.type('test_admin')

        const $inputPassword = await queries.getByLabelText($document, 'Password')
        expect($inputPassword).not.toBeNull()
        await $inputPassword.type('test')

        const $signIn = await queries.getByText($document, 'Sign In')
        expect($signIn).not.toBeNull()
        await $signIn.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })

        // erpbarczok
        $document = await getDocument(page)
        const $userName = await queries.getByText($document, 'test_admin@erpbarczok.de')
        expect($userName).not.toBeNull()


        await $userName.click()
        const $logout = await queries.getByText($document, 'Logout')
        expect($logout).not.toBeNull()

        await $logout.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })

        // keycloak logout
        $document = await getDocument(page)
        const $signout = await queries.getByText($document, 'Logout')
        await $signout.click()
        await page.waitForNavigation({ waitUntil: 'networkidle0' })

        // login page 
        $document = await getDocument(page)
        const $login2 = await queries.getByText($document, "Login")
        expect($login2).not.toBeNull()
    })
})