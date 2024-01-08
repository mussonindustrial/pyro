var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
var { getWebdevClient } = require('./setup')

async function uploadResource(gateway, resource_type, path, file_buffer) {
    const client = await getWebdevClient(gateway)
    await client
        .post(`${resource_type}${path}`, file_buffer, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch(function (error) {
            console.log({ error })
        })
    return true
}

async function uploadThemes(gateway) {
    const files = await glob('output/themes/**/*.*')
    for (const f of files) {
        const source = f.replaceAll('\\', '/')
        await gateway.copyThemeFileToContainer(source)
    }

    return true
}

async function uploadFonts(gateway) {
    await gateway.copyFontDirectoryToContainer('output/fonts/Inter')
    return true
}

async function uploadProjectImport(gateway) {
    await gateway.importProjectResources(
        'pyro-mui-joy-testing',
        'output/project-import.zip'
    )

    // const buffer = fs.readFileSync('output/project-import.zip')
    // await uploadResource(
    //     gateway,
    //     'projectImport',
    //     '/project-import.zip',
    //     buffer
    // )

    return true
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

async function requestScan(gateway) {
    const client = await getWebdevClient(gateway)
    await client.get('/requestScan')
    return true
}

async function refreshSessions(gateway) {
    const client = await getWebdevClient(gateway)
    await client.get('/refreshSessions')
    return true
}

module.exports = {
    uploadResource,
    uploadProjectImport,
    uploadFonts,
    uploadThemes,
    requestScan,
    refreshSessions,
}
