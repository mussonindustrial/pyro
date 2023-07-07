import { ResourceInstance } from './resources'
import _, { bind } from 'lodash'
import crypto from 'crypto'
import JSZip from 'jszip'

export type Resource = {
    scope: string
    version: number
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    files: string[]
    attributes: Record<string, object | string>
}

export function newResourceJson<T>(filePaths: ResourceInstance<T>) {
    return {
        scope: 'G',
        version: 1,
        restricted: false,
        overridable: true,
        files: Object.values(filePaths),
        attributes: {
            lastModification: {
                actor: 'bmusson',
                timestamp: '2023-06-28T17:48:27Z',
                // actor: 'ignition-import',
                // timestamp: new Date().toISOString(),
            },
        },
    } as Resource
}

export async function getResourceContents<T>(
    filePaths: ResourceInstance<T>,
    folder: JSZip
) {
    const resource = newResourceJson(filePaths)

    let files = {}
    for (const path of Object.values(filePaths)) {
        if (typeof path === 'string') {
            files = {
                ...files,
                [path]: await folder.file(path)?.async('nodebuffer'),
            }
        }
    }

    const hash = await calculateSignature(resource, files)
    resource.attributes.lastModificationSignature = hash
    return JSON.stringify(resource, null, 2)
}

function toByteArray(value: number) {
    return Buffer.from([
        (value >> 24) & 0xff,
        (value >> 16) & 0xff,
        (value >> 8) & 0xff,
        value & 0xff,
    ])
}

function toByte(value: boolean) {
    return Buffer.from([value ? 1 : 0])
}

export async function calculateSignature(
    resource: Resource,
    files: Record<string, Buffer>
) {
    const hash = crypto.createHash('sha256')

    hash.update(toByteArray(1))

    if (resource.documentation) {
        hash.update(Buffer.from(resource.documentation))
    }

    hash.update(toByteArray(resource.version))
    if (resource.locked !== undefined) {
        hash.update(toByte(resource.locked))
    }
    hash.update(toByte(resource.restricted))
    hash.update(toByte(resource.restricted))
    hash.update(toByte(resource.overridable))

    for (const path of resource.files.sort()) {
        hash.update(path)
        const file = files[path]
        if (file) {
            hash.update(file)
        } else {
            hash.update(Buffer.from([]))
        }
    }

    const nonSignatureAttributes = { ...resource.attributes }
    delete nonSignatureAttributes.lastModificationSignature
    const sortedAttributes = Object.entries(nonSignatureAttributes).sort(
        (a, b) => a[0].localeCompare(b[0])
    )
    sortedAttributes.forEach(([key, value]) => {
        hash.update(key)
        hash.update(JSON.stringify(value))
    })

    const digest = hash.digest()
    return digest.toString('hex')
}
