export type ResourceInstance<T, U = string> = Record<keyof T, U>
export type ResourceType = string | object | ArrayBuffer | Buffer | Blob

export type Node<T> = {
    type: 'node'
    content: ResourceInstance<T, ResourceType>
}

export type Folder<T> = {
    type: 'folder'
    content: Record<string, Node<T> | Folder<T>>
}

export type BaseResource<T> = {
    path: string
    filePaths: ResourceInstance<T, string>
}

export type NodeResource<T> = BaseResource<T> & Node<T>

export type FolderResource<T> = BaseResource<T> & Folder<T>

export function isNode<T>(resource: unknown): resource is Node<T> {
    return (resource as Node<T>).type == 'node'
}

export function isFolder<T>(resource: unknown): resource is Folder<T> {
    return (resource as Folder<T>).type == 'folder'
}

export const newNode = function <T>(name: string, content: T) {
    return {
        [name]: {
            type: 'node',
            content,
        } as Node<T>,
    }
}

export const newFolder = function <T>(name: string, content: T) {
    return {
        [name]: {
            type: 'folder',
            content,
        } as Folder<T>,
    }
}

const newBaseResource = function <T extends Record<string, string>>(
    path: string,
    filePaths: T
) {
    return {
        path,
        filePaths,
    } as BaseResource<T>
}

export const newNodeResource = function <T extends Record<string, string>>(
    path: string,
    filePaths: T
) {
    return {
        ...newBaseResource(path, filePaths),
        type: 'node',
        content: {} as Node<T>,
    } as NodeResource<T>
}

export const newFolderResource = function <T extends Record<string, string>>(
    path: string,
    filePaths: T
) {
    return {
        ...newBaseResource(path, filePaths),
        type: 'folder',
        content: {},
    } as FolderResource<T>
}

export const newModule = function <T>(path: string, resources: T) {
    return {
        path,
        resources,
    }
}
