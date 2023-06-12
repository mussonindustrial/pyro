import fs from 'fs'
import JSZip from 'jszip'
import {
    emptyProject,
    isModuleResourceFolder,
    isModuleResourceSingleton,
    Module,
    ModuleResourceFolder,
    ModuleResourceSingleton,
    ResourceFolder,
    type Project,
    isResourceFolder,
    isResourceNode,
    ResourceNode,
    newResourceJSON,
} from './resources'

function zipModule(folder: JSZip, module: Module): JSZip {
    console.log(`Zip-ing module ${module.path}`)

    const moduleFolder = folder.folder(module.path)

    if (moduleFolder === null) {
        console.error(`Error creating folder for ${module.path}`)
        console.warn(`Skipping resource creating for ${module.path}`)
        return folder
    }

    Object.values(module.resources).forEach((resource) => {
        zipResource(moduleFolder, resource)
    })

    return folder
}

function zipResource<T>(
    parent: JSZip,
    resource: ModuleResourceSingleton<T> | ModuleResourceFolder<T>
): JSZip {
    console.log(`Zip-ing resource ${resource.path}`)

    if (isModuleResourceFolder(resource)) {
        zipModuleResourceFolder(parent, resource)
    }

    if (isModuleResourceSingleton(resource)) {
        zipModuleResourceSingleton(parent, resource)
    }

    return parent
}

function zipModuleResourceFolder<T>(
    parent: JSZip,
    resource: ModuleResourceFolder<T>
) {
    console.log(`Zip-ing ${resource.path} as a ModuleResourceFolder.`)
    if (resource.root == null) {
        console.log(`No root folder for resource ${resource.path}`)
        return
    }

    const resourceFolder = parent.folder(resource.path)
    if (resourceFolder === null) {
        console.error(`Error creating folder for ${resource.path}`)
        console.warn(`Skipping resource creating for ${resource.path}`)
        return
    }

    zipResourceFolder(resourceFolder, resource, resource.root)
}

function zipResourceFolder<T>(
    parent: JSZip,
    root: ModuleResourceFolder<T>,
    resourceFolder: ResourceFolder<T>
) {
    console.log(`Zip-ing ${JSON.stringify(resourceFolder)} as a ResourceFolder`)
    Object.entries(resourceFolder.children).forEach(([key, value]) => {
        if (typeof value !== 'object') {
            return
        }
        console.log(`Resource Folder key: ${key} value: ${value}`)
        const resourceFolder = parent.folder(key)
        if (resourceFolder == null) {
            console.error('Failed to create resource folder')
            return
        }

        if (isResourceFolder(value)) {
            zipResourceFolder(resourceFolder, root, value)
        }

        if (isResourceNode(value)) {
            zipResourceNode(resourceFolder, root, value)
        }
    })
}

function zipResourceNode<T>(
    parent: JSZip,
    rootResource: ModuleResourceFolder<T>,
    resource: ResourceNode<T>
) {
    console.log(`Zip-ing ${JSON.stringify(resource)} as a ResourceNode`)
    const files: string[] = []
    Object.entries(rootResource.files).forEach(([key, path]) => {
        console.log(
            `Reading content ${key} from ${JSON.stringify(resource.content)}`
        )
        const content = resource.content[key as keyof T]
        if (content == null) {
            return
        }
        files.push(path as string)
        parent.file(path as string, JSON.stringify(content))
    })
    parent.file('resource.json', newResourceJSON({ files }))
}

function zipModuleResourceSingleton<T>(
    parent: JSZip,
    resource: ModuleResourceSingleton<T>
) {
    console.log(`Zip-ing ${resource.path} as a ModuleResourceSingleton`)
    const resourceFolder = parent.folder(resource.path)
    if (resourceFolder === null) {
        console.error(`Error creating folder for ${resource.path}`)
        console.warn(`Skipping resource creating for ${resource.path}`)
        return
    }
    Object.entries(resource.files).forEach(([key, path]) => {
        console.log(resource)
        if (resource.content == null) {
            console.log(`No content for resource ${resource.path}`)
            return
        }
        const content = resource.content[key as keyof T]
        resourceFolder.file(path as string, content as string)
    })
}

class ProjectResourceBuilder {
    public project: Project

    constructor() {
        this.project = emptyProject
    }

    public async write(output: string) {
        const zip = new JSZip()

        Object.values(this.project).forEach((module) => {
            zipModule(zip, module)
        })

        const generatedZip = await zip.generateAsync({
            type: 'nodebuffer',
        })
        fs.promises.writeFile(output, generatedZip)
    }
}

// createBuilder supplies a new builder.
export function createBuilder() {
    return new ProjectResourceBuilder()
}
