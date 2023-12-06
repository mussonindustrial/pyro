var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
import { getWebdevClient } from './setup' 

const fontDir = path.join('output', 'fonts')
const themeDir = path.join('output', 'themes')

async function uploadResource(gateway, resource_type, path, file_buffer) {
    const client = await getWebdevClient(gateway)
    await client.post(
        `${resource_type}${path}`,
        file_buffer,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    ).catch(function (error) {
        console.log({error})
    })
    return true
}

async function uploadThemes(gateway) {
    console.log('uploading themes')

    const files = await glob('output/themes/**/*.*')
    for (const f of files) {
        const buffer = fs.readFileSync(f)
        const name = f.replace(themeDir, '').replaceAll('\\', '/') 
        console.log({theme: name})
        await uploadResource(gateway, 'themes', name, buffer)
    }

    return true
}

async function uploadFonts(gateway) {
    console.log('uploading fonts')

    const files = await glob('output/fonts/**/*.*')
    console.log(files)
    for (const f of files) {
        const buffer = fs.readFileSync(f)
        const name = f.replace(fontDir, '').replaceAll('\\', '/')
        console.log({font: name})
        await uploadResource(gateway, 'fonts', name, buffer)
    }
    return true
}


async function uploadProjectImport(gateway) {
    console.log('uploading project import')
    const buffer = fs.readFileSync('output/project-import.zip')
    console.log({project: buffer})
    await uploadResource(gateway, 'projectImport', '/project-import.zip', buffer)
    return true
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
async function requestScan(gateway) {
    console.log('requesting project scan')
    const client = await getWebdevClient(gateway)
    await client.get(
        '/requestScan'
    )
    await delay(10000)
    return true
}

module.exports = { uploadResource, uploadProjectImport, uploadFonts, uploadThemes, requestScan }