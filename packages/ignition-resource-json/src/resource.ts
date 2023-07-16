import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { serializeScope, toByte, toByteArray } from './util'
import {
    Resource,
    CommonResourceAttributes,
    ResourceFiles,
    ResourceProperties,
} from './types'

export async function newResource<T extends string>(
    props: Partial<ResourceProperties>,
    files: ResourceFiles<T>
) {
    const resource = {
        scope: props.scope || 'none',
        version: props.version || 1,
        restricted: props.restricted || false,
        overridable: props.overridable || true,
        files: Object.keys(files),
        attributes: {
            lastModification: {
                actor:
                    props.actor || process.env.USER || 'ignition-resource-json',
                timestamp: props.timestamp || new Date().toISOString(),
            },
            lastModificationSignature: '',
            ...props.customAttributes,
        },
    } as Resource<T>

    resource.attributes.lastModificationSignature = await calculateSignature(
        resource,
        files
    )
    return resource
}

export async function parseResource<T extends string[]>(folder: string) {
    const r = fs.readFileSync(path.join(folder, 'resource.json'))

    const resource = JSON.parse(r.toString()) as Resource<T[number]>

    let files = {}
    for (const file of resource.files) {
        const f = file as string
        files = {
            ...files,
            [f]: fs.readFileSync(path.join(folder, f)),
        }
    }

    return {
        resource,
        files: files as ResourceFiles<T[number]>,
    }
}

export async function calculateSignature<T extends string>(
    resource: Resource<T>,
    files: ResourceFiles<T>
) {
    const hash = crypto.createHash('sha256')

    hash.update(toByteArray(serializeScope(resource.scope)))

    if (resource.documentation) {
        hash.update(Buffer.from(resource.documentation))
    }

    hash.update(toByteArray(resource.version))
    if (resource.locked !== undefined) {
        hash.update(toByte(resource.locked))
    } else {
        hash.update(toByte(false))
    }
    hash.update(toByte(resource.restricted))
    hash.update(toByte(resource.overridable))

    for (const path of resource.files.sort()) {
        const p = path as keyof typeof files
        hash.update(p)
        const file = files[p]
        if (file) {
            hash.update(file)
        } else {
            hash.update(Buffer.from([]))
        }
    }

    const signatureAttributes = {
        ...resource.attributes,
    } as Partial<CommonResourceAttributes>
    delete signatureAttributes.lastModificationSignature

    Object.entries(signatureAttributes)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .forEach(([key, value]) => {
            hash.update(key)
            hash.update(JSON.stringify(value))
        })

    const digest = hash.digest()
    return digest.toString('hex')
}

export async function hasValidSignature<T extends string>(
    resource: Resource<T>,
    files: ResourceFiles<T>
) {
    return (
        resource.attributes.lastModificationSignature ===
        (await calculateSignature(resource, files))
    )
}
