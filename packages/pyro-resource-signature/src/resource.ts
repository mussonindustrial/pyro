import fs from 'fs'
import path from 'path'

import {
    UserProvidedProps,
    ResourceFiles,
    Resource,
    PartialResourceProps,
    CompleteResourceProps,
} from './types'
import { calculateSignature } from './crypto'

export async function newResource<TFiles extends string, TAttributes = {}>(
    props: PartialResourceProps<TFiles, TAttributes>,
    files: ResourceFiles<TFiles>
) {
    let userProps = {
        scope: props.scope ?? 'A',
        version: props.version ?? 1,
        restricted: props.restricted ?? false,
        overridable: props.overridable ?? true,
        documentation: props.documentation ?? undefined,
        files: Object.keys(files),
        attributes: {
            ...props.attributes,
            lastModification: {
                actor:
                    props.attributes?.lastModification?.actor ??
                    process.env.USER ??
                    'pyro-resource-signature',
                timestamp:
                    props.attributes?.lastModification?.timestamp ??
                    new Date().toISOString().split('.')[0]+"Z",
            },
        },
    } as UserProvidedProps<TFiles, TAttributes>

    return {
        props: await applySignature(userProps, files),
        files,
    } as Resource<TFiles, TAttributes>
}

export async function parseResource<TFiles extends string[], TExtProps = {}>(
    folder: string
) {
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
    } as Resource<TFiles[number], TExtProps>
}

async function applySignature<TFiles extends string, TAttributes = {}>(
    props: UserProvidedProps<TFiles, TAttributes>,
    files: ResourceFiles<TFiles>
) {
    // @ts-ignore
    props.attributes.lastModificationSignature = await calculateSignature({
        // @ts-ignore
        props,
        files,
    })
    return props as CompleteResourceProps<TFiles, TAttributes>
}
