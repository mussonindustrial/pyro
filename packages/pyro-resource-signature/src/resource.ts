import fs from 'fs'
import path from 'path'

import {
    ResourceProps,
    ResourceFiles,
    Resource,
    PartialResourceProps,
} from './types'
import { calculateSignature } from './crypto'

export async function newResource<T extends string>(
    props: PartialResourceProps<T>,
    files: ResourceFiles<T>
) {
    const newProps = {
        scope: props.scope ?? 'none',
        version: props.version ?? 1,
        restricted: props.restricted ?? false,
        overridable: props.overridable ?? true,
        files: Object.keys(files),
        attributes: {
            lastModification: {
                actor:
                    props.attributes?.lastModification?.actor ??
                    process.env.USER ??
                    'pyro-resource-signature',
                timestamp:
                    props.attributes?.lastModification?.timestamp ??
                    new Date().toISOString(),
            },
            lastModificationSignature: '',
            ...props.attributes?.customAttributes,
        },
    } as ResourceProps<T>

    newProps.attributes.lastModificationSignature = await calculateSignature({
        props: newProps,
        files,
    })
    return {
        props: newProps,
        files,
    } as Resource<T>
}

export async function parseResource<T extends string[]>(folder: string) {
    const r = fs.readFileSync(path.join(folder, 'resource.json'))

    const props = JSON.parse(r.toString())

    let files = {}
    for (const file of props.files) {
        const f = file as string
        files = {
            ...files,
            [f]: fs.readFileSync(path.join(folder, f)),
        }
    }

    return {
        props,
        files,
    } as Resource<T[number]>
}
