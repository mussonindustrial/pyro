var { IgnitionContainer } = require('@mussonindustrial/pyro-gateway')
var puppeteer = require('puppeteer')
var axios = require('axios')

const projectName = 'pyro-symbol-testing'

async function createGateway() {
    const gateway = await new IgnitionContainer(
        'inductiveautomation/ignition:8.1.33'
    )
        .withGatewayBackup('./dev/backup.gwbk')
        .withModules(['perspective', 'web-developer'])
    gateway.env.GATEWAY_ADMIN_USERNAME = 'admin'
    gateway.env.GATEWAY_ADMIN_PASSWORD = 'password'

    return gateway.start()
}
async function resetTrial(gateway) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto(await gateway.getRootURL(), { waitUntil: 'networkidle2' })
    await Promise.all([page.click('#login-link'), page.waitForNavigation()])
    await page.$eval('.username-field', (el) => (el.value = 'admin'))
    await page.click('.submit-button')
    await page.$eval('.password-field', (el) => (el.value = 'password'))
    await Promise.all([
        page.click('.submit-button'),
        page.waitForNavigation(),
        page.waitForSelector('#reset-trial-anchor'),
    ])
    await page.click('#reset-trial-anchor')
}

async function getWebdevClient(gateway) {
    return axios.create({
        baseURL: gateway.getWebdevUrl(projectName).toString(),
        timeout: 1000,
    })
}

module.exports = { resetTrial, createGateway, getWebdevClient }
