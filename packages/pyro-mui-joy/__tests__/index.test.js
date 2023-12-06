var puppeteer = require('puppeteer')
var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
import { it,  beforeAll } from 'vitest'
import { uploadFonts, uploadThemes, uploadProjectImport, requestScan } from './upload'
import { createGateway, resetTrial, getTestPageURI } from './setup'


let gateway;

beforeAll(async () => { 

    console.log('creating gateway')
    gateway = await createGateway()
    // await resetTrial(gateway)
    await uploadFonts(gateway)
    await uploadThemes(gateway)
    await uploadProjectImport(gateway)
    await requestScan(gateway)

}, 60000)

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }


async function takeScreenshot() {
    console.log('taking screenshot')
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto(await getTestPageURI(gateway),  { waitUntil: 'networkidle2' })

    await page.setViewport({
        width: 1280,
        height: 1024,
        deviceScaleFactor: 2,
    })
    await page.screenshot({
        path: './__tests__/test.png',
    })
}

it('should get here', async () => {
    console.log('test')
    await takeScreenshot()
}, 60000)