var puppeteer = require('puppeteer')
var fs = require('fs')
var path = require('path')
const { take } = require('lodash')

const output = 'screenshots'
const themeDir = 'output'
const perspectiveComponents = './lib/PerspectiveComponents.css'
const perspectiveClient = './lib/PerspectiveClient.css'

function getOutputDir(theme) {
    return path.join(output, theme)
}

function getTheme(theme) {
    return path.join('.', themeDir, `${theme}.css`)
}

function cleanScreenshots() {
    fs.rmSync(output, { recursive: true, force: true })
}

async function generateScreenshots(theme) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await takeScreenshots(page, theme)

    await browser.close()
}

async function takeScreenshots(page, theme) {
    const dir = getOutputDir(theme)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    await takeScreenshot(page, 'background', theme, {
        width: 415,
        height: 325,
        deviceScaleFactor: 3,
    })
    await takeScreenshot(page, 'button', theme, {
        width: 415,
        height: 325,
        deviceScaleFactor: 3,
    })
    await takeScreenshot(page, 'card', theme, {
        width: 350,
        height: 415,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'card-overflow', theme, {
        width: 700,
        height: 500,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'chip', theme, {
        width: 450,
        height: 285,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'color-inversion', theme, {
        width: 700,
        height: 500,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'dropdown', theme, {
        width: 550,
        height: 325,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'numeric-entry', theme, {
        width: 900,
        height: 325,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'text-field', theme, {
        width: 900,
        height: 325,
        deviceScaleFactor: 2,
    })
    await takeScreenshot(page, 'typography', theme, {
        width: 200,
        height: 350,
        deviceScaleFactor: 3,
    })
}

async function takeScreenshot(page, testPage, theme, viewport) {
    await page.goto(`file://${__dirname}/${testPage}.html`)
    await page.addStyleTag({ path: perspectiveComponents })
    await page.addStyleTag({ path: perspectiveClient })
    await page.addStyleTag({ path: getTheme(theme) })

    await page.setViewport(viewport)
    await page.screenshot({
        path: path.join(getOutputDir(theme), `${testPage}.png`),
    })
}

module.exports = { generateScreenshots, cleanScreenshots }
