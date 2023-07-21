import { ResourceFiles } from 'ignition-resource-json'

export type Node<T extends string> = {
    type: 'node'
    content: ResourceFiles<T>
}

type FolderFunction<TResource extends string> = {
    (...path: string[]): Folder<TResource>
}

type NodeFunction<TResource extends string> = {
    (node: string, content: ResourceFiles<TResource>): void
    (path: string[], content: ResourceFiles<TResource>): void
}

export type Folder<TResource extends string> = {
    type: 'folder'
    content: {
        [key: string]: Node<TResource> | Folder<TResource>
    }
    folder: FolderFunction<TResource>
    node: NodeFunction<TResource>
}

export type BaseResource<TResource extends string> = {
    path: string
    filePaths: ResourceFiles<TResource>
}

export type NodeResource<TResource extends string> = BaseResource<TResource> &
    Node<TResource>

export type FolderResource<TResource extends string> = BaseResource<TResource> &
    Folder<TResource>

export function isNode<TResource extends string>(
    resource: unknown
): resource is Node<TResource> {
    return (resource as Node<TResource>).type == 'node'
}

export function isFolder<TResource extends string>(
    resource: unknown
): resource is Folder<TResource> {
    return (resource as Folder<TResource>).type == 'folder'
}

const newNode = function <TResource extends string>(
    content: ResourceFiles<TResource>
) {
    return {
        type: 'node',
        content,
    } as Node<TResource>
}

const newFolder = function <
    TResource extends string,
    TFolderChildren extends string
>(content: {
    [key in TFolderChildren]: Node<TResource> | Folder<TResource>
}) {
    return {
        type: 'folder',
        content,
        folder: function (...path: string[]): Folder<TResource> {
            const folder = newFolder({})
            let childFolder = folder

            let children: string[] = []
            let childName = ''

            childName = path.shift() as string

            if (childName) {
                children = path
            }

            if (children.length !== 0) {
                for (const p of children) {
                    childFolder = childFolder.folder(p)
                }
            }

            this.content[childName] = folder
            return childFolder
        },
        node: function (
            path: string | string[],
            content: ResourceFiles<TResource>
        ): void {
            if (path instanceof Array) {
                const nodeName = path.pop()
                if (nodeName) {
                    if (path.length > 0) {
                        this.folder(...path).node(nodeName, content)
                    } else {
                        return this.node(nodeName, content)
                    }
                }
            } else {
                this.content[path] = newNode(content)
            }
        },
    } as Folder<TResource>
}

const newBaseResource = function <
    const TResourceFiles extends readonly string[]
>(path: string, filePaths: TResourceFiles) {
    return {
        path,
        filePaths,
    } as BaseResource<TResourceFiles[number]>
}

export const newNodeResource = function <
    const TResourceFiles extends readonly string[]
>(path: string, filePaths: TResourceFiles) {
    return {
        ...newBaseResource(path, filePaths),
        ...(newNode({}) as Node<TResourceFiles[number]>),
    } as NodeResource<TResourceFiles[number]>
}

export const newFolderResource = function <
    const TResourceFiles extends readonly string[]
>(path: string, filePaths: TResourceFiles) {
    return {
        ...newBaseResource(path, filePaths),
        ...newFolder({}),
    } as FolderResource<TResourceFiles[number]>
}

export const newModule = function <T>(path: string, resources: T) {
    return {
        path,
        resources,
    }
}
