import JSZip from 'jszip'
import {
    Folder,
    FolderResource,
    Node,
    NodeResource,
    ResourceInstance,
    isFolder,
    isNode,
} from './resources'
import _ from 'lodash'
import { createResourceJson } from './resourceJson'

export const newProject = function <T extends object>(modules: T) {
    const clonedModules = _.cloneDeep(modules)
    return {
        ...clonedModules,
        zip: async function () {
            const zip = new JSZip()

            for (const module of Object.values(clonedModules)) {
                await zipModule(zip, module)
            }

            return await zip.generateAsync({
                type: 'nodebuffer',
            })
        },
    }
}

async function zipModule<T>(
    zip: JSZip,
    module: {
        path: string
        resources: Record<string, FolderResource<T> | NodeResource<T>>
    }
) {
    console.log(`Zip-ing module ${module.path}`)
    let generated = false

    const moduleFolder = zip.folder(module.path)

    if (moduleFolder === null) {
        console.error(`Error creating folder for ${module.path}`)
        console.warn(`Skipping resource creating for ${module.path}`)
        return zip
    }

    for (const resource of Object.values(module.resources)) {
        console.log(`Zip-ing resource ${resource.path}`)
        const resourceSaved = await zipResource(
            moduleFolder,
            resource.path,
            resource.filePaths,
            resource
        )
        if (resourceSaved) {
            generated = true
        }
    }

    if (!generated) {
        zip.remove(module.path)
    }
    return zip
}

async function zipResource<T>(
    zip: JSZip,
    key: string,
    filePaths: ResourceInstance<T>,
    resource: Node<T> | Folder<T>
) {
    let generated = false
    const f = zip.folder(key)

    if (f === null) {
        console.error(`Error creating folder for ${key}`)
        console.warn(`Skipping resource creating for ${key}`)
        return false
    }

    if (isNode(resource)) {
        let key: keyof typeof filePaths
        for (key in filePaths) {
            let data = resource.content[key]
            if (data) {
                if (typeof data === 'object') {
                    data = JSON.stringify(data, null, `\t`)
                }
                f.file(filePaths[key], data)
                generated = true
            }
        }

        if (generated) {
            await createResourceJson(filePaths, f)
        }
    }
    if (isFolder(resource)) {
        for (const [key, res] of Object.entries(resource.content)) {
            const result = await zipResource(f, key, filePaths, res)
            if (result) {
                generated = true
            }
        }
    }

    if (!generated) {
        zip.remove(key)
        console.log(`no content generated, removing ${key}`)
    }
    return generated
}
