// import puppeteer from 'puppeteer'
// import { getDocument, queries } from 'pptr-testing-library'
// import { expect } from 'expect'


// const browser = await puppeteer.launch()
// const page = await browser.newPage()

// describe('config page', function () {

//     before(async function () {
//         await page.setViewport({ width: 1920, height: 1080 })
//         await page.goto('http://localhost:3000/config.js')

//     })

//     after(async function () { await browser.close() })

//     it('displays config page', async function () {
//         console.log('1')
//         const $document = await getDocument(page)
//         console.log('2')
//         const config = await queries.getByText($document,"window.client_id", {exact: false})
//         console.log('3')
//         expect(config).not.toBeNull()
//         console.log('4')
//     })
// })