import JSZip from 'jszip'
import {
    Folder,
    FolderResource,
    Node,
    NodeResource,
    isFolder,
    isNode,
} from './resources'
import _ from 'lodash'
import { createResourceJson } from './resourceJson'
import chalk from 'chalk'

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

async function zipModule<TResource, TProps>(
    zip: JSZip,
    module: {
        path: string
        resources: Record<
            string,
            FolderResource<TResource, TProps> | NodeResource<TResource, TProps>
        >
    }
) {
    console.log(`${chalk.blue(module.path)}`)
    let generated = false

    const moduleFolder = zip.folder(module.path)

    if (moduleFolder === null) {
        console.error(`Error creating folder for ${module.path}`)
        console.warn(`Skipping resource creating for ${module.path}`)
        return zip
    }

    for (const resource of Object.values(module.resources)) {
        const resourceSaved = await zipResource(
            moduleFolder,
            resource.path,
            resource,
            resource
        )
        if (resourceSaved) {
            console.log(`${chalk.green('✓')} ${resource.path}`)
            generated = true
        } else {
            console.log(`${chalk.gray('-')} ${chalk.gray(resource.path)}`)
        }
    }

    if (!generated) {
        zip.remove(module.path)
    }
    return zip
}

async function zipResource<TResource, TProps>(
    zip: JSZip,
    key: string,
    root: NodeResource<TResource, TProps> | FolderResource<TResource, TProps>,
    resource: Node<TResource, TProps> | Folder<TResource, TProps>
) {
    let generated = false
    const f = zip.folder(key)

    if (f === null) {
        console.error(`Error creating folder for ${key}`)
        console.warn(`Skipping resource creating for ${key}`)
        return false
    }

    if (isNode(resource)) {
        const filePaths = Object.keys(resource.files as {})

        for (const path of filePaths) {
            let data: any = resource.files[path as keyof TResource]
            if (data) {
                if (typeof data === 'object') {
                    data = JSON.stringify(data, null, `\t`)
                }
                f.file(path, data)
                generated = true
            }
        }

        if (generated) {
            await createResourceJson(f, root, resource)
        }
    }
    if (isFolder(resource)) {
        for (const [key, res] of Object.entries(resource.children)) {
            const result = await zipResource(f, key, root, res!)
            if (result) {
                generated = true
            }
        }
    }

    if (!generated) {
        zip.remove(key)
        // console.log(`no content generated for ${key}`)
    }
    return generated
}
