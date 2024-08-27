var { parseString, Builder } = require('xml2js')
var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
var { getWebdevClient } = require('./setup')
const { GATEWAY_PATH } = require('@mussonindustrial/pyro-gateway')

const builder = new Builder({ rootName: 'svg' })

async function parseSVG(path) {
    var xmlString = await fs.promises.readFile(path, 'utf-8')

    var JSONdata
    parseString(xmlString, function (err, result) {
        if (err) {
            console.log('There was an error when parsing: ' + err)
        } else {
            JSONdata = result
            var name = path.split('/').pop().replace('.svg', '')
            var viewBox = JSONdata.svg.$.viewBox

            JSONdata['svg']['$'] = {
                class: 'pyro-symbol icon',
                id: name,
                viewBox,
            }
        }
    })

    return JSONdata
}

async function createSymbolLibrary(name) {
    var path = './src/icons/svg'

    const files = await glob(`${path}/*.svg`)

    var SVGS = []

    for (const f of files) {
        var xmlDoc = await parseSVG(f.replaceAll('\\', '/'))
        SVGS.push(xmlDoc)
    }
    var library = builder.buildObject(SVGS)

    await fs.promises.mkdir('./output/icons', { recursive: true })

    await fs.writeFile(
        `output/icons/${name}.svg`,
        library.toString(),
        function (err) {
            if (err) {
                console.log('Failed saving symbol library')
            }
        }
    )
}

async function uploadResource(gateway, resource_type, path, file_buffer) {
    const client = await getWebdevClient(gateway)
    await client
        .post(`${resource_type}${path}`, file_buffer, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            W,
        })
        .catch(function (error) {
            console.log({ error })
        })
    return true
}

async function uploadThemes(gateway) {
    const files = await glob('output/themes/**/*.*')

    const filesToCopy = []
    for (const f of files) {
        filesToCopy.push({
            folder: GATEWAY_PATH.PERSPECTIVE_THEMES,
            source: f.replaceAll('\\', '/'),
        })
    }

    await gateway.copyFilesToGateway(filesToCopy)
    return true
}

async function uploadFonts(gateway) {
    await gateway.copyDirectoriesToGateway([
        {
            folder: GATEWAY_PATH.PERSPECTIVE_FONTS,
            source: 'output/fonts/Inter',
        },
    ])
    return true
}

async function uploadIcons(gateway) {
    const files = await glob('output/icons/**/*.*')

    const filesToCopy = []
    for (const f of files) {
        console.log('File: ', f)
        filesToCopy.push({
            folder: GATEWAY_PATH.PERSPECTIVE_ICONS,
            source: f.replaceAll('\\', '/'),
        })
    }

    await gateway.copyFilesToGateway(filesToCopy)
    return true
}

async function uploadProjectImport(gateway) {
    await gateway.importProjectResources(
        'pyro-symbol-testing',
        'output/project-import.zip'
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
    return true
}

async function refreshSessions(gateway) {
    const client = await getWebdevClient(gateway)
    await client.get('/refreshSessions')
    return true
}

module.exports = {
    createSymbolLibrary,
    uploadResource,
    uploadProjectImport,
    uploadFonts,
    uploadIcons,
    uploadThemes,
    requestScan,
    refreshSessions,
}
