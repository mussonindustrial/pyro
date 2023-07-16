import crypto from 'crypto'

import { CommonResourceAttributes, Resource } from './types'
import { serializeScope, toByte, toByteArray } from './util'

export async function calculateSignature<T extends string>(
    resource: Resource<T>
) {
    const hash = crypto.createHash('sha256')

    hash.update(toByteArray(serializeScope(resource.props.scope)))

    if (resource.props.documentation) {
        hash.update(Buffer.from(resource.props.documentation))
    }

    hash.update(toByteArray(resource.props.version))
    if (resource.props.locked !== undefined) {
        hash.update(toByte(resource.props.locked))
    } else {
        hash.update(toByte(false))
    }
    hash.update(toByte(resource.props.restricted))
    hash.update(toByte(resource.props.overridable))

    for (const path of resource.props.files.sort()) {
        const p = path as keyof typeof resource.files
        hash.update(p)
        const file = resource.files[p]
        if (file) {
            hash.update(file)
        } else {
            hash.update(Buffer.from([]))
        }
    }

    const signatureAttributes = {
        ...resource.props.attributes,
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
    resource: Resource<T>
) {
    return (
        resource.props.attributes.lastModificationSignature ===
        (await calculateSignature(resource))
    )
}

export async function updateSignature<T extends string>(resource: Resource<T>) {
    const signature = await calculateSignature(resource)

    if (resource.props.attributes.lastModificationSignature === signature) {
        return false
    } else {
        resource.props.attributes.lastModificationSignature == signature
        return true
    }
}
