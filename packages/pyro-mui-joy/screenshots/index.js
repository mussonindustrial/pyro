var puppeteer = require('puppeteer')
var fs = require('fs')
var path = require('path')
var { glob } = require('glob')

const output = 'screenshots/output'
const themeDir = 'output'
const perspectiveComponents = './lib/PerspectiveComponents.css'
const perspectiveClient = './lib/PerspectiveClient.css'

function themePath(theme) {
    return path.join('.', themeDir, `${theme}.css`)
}

function cleanScreenshots() {
    fs.rmSync(output, { recursive: true, force: true })
}

async function build(theme) {

    const tests = await glob("screenshots/__tests__/**/*.html")
    console.log(`Generating ${tests.length} screenshots for theme ${theme}`)

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    const takeScreenshot = async function (testPath) {

        var testSource = testPath.split(path.sep)
        testSource.shift()
        testSource = path.join(...testSource)
        const testFile = `file://${__dirname}/${testSource}`

        const screenshotPath = path.format(
            { ...path.parse(testPath.replace('__tests__', `output/${theme}`)),
                base: '',
                ext: '.png' }
            )
        
        const folder = screenshotPath.split(path.sep)
        folder.pop()
        const folderPath = path.join(...folder)

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }
 
        await page.goto(testFile)
        await page.addStyleTag({ path: perspectiveComponents })
        await page.addStyleTag({ path: perspectiveClient })
        await page.addStyleTag({ path: themePath(theme) })

        await page.setViewport({width: 1280, height: 1024, deviceScaleFactor: 2})
        await page.screenshot({
            path: screenshotPath,
        })

        console.log(`Saved ${screenshotPath}`)
    }

    for (const test of tests) {
        await takeScreenshot(test)
    }

    await browser.close()
}

module.exports = { build, cleanScreenshots }
