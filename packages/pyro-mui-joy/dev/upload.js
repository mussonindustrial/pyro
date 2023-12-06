var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
var { getWebdevClient } = require('./setup')

const fontDir = path.join('output', 'fonts')
const themeDir = path.join('output', 'themes')

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
        const buffer = fs.readFileSync(f)
        const name = f.replace(themeDir, '').replaceAll('\\', '/')
        await uploadResource(gateway, 'themes', name, buffer)
    }

    return true
}

async function uploadFonts(gateway) {
    const files = await glob('output/fonts/**/*.*')
    for (const f of files) {
        const buffer = fs.readFileSync(f)
        const name = f.replace(fontDir, '').replaceAll('\\', '/')
        // console.log(name)
        await uploadResource(gateway, 'fonts', name, buffer)
    }
    return true
}

async function uploadProjectImport(gateway) {
    const buffer = fs.readFileSync('output/project-import.zip')
    await uploadResource(
        gateway,
        'projectImport',
        '/project-import.zip',
        buffer
    )
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
    await delay(10000)
    return true
}

async function refreshSessions(gateway) {
    const client = await getWebdevClient(gateway)
    await client.get('/refreshSessions')
    await delay(10000)
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
