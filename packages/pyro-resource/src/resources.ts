import { ResourceFiles } from '@mussonindustrial/pyro-resource-signature'

type NodeType = 'folder' | 'node'

export class Folder<TResource extends string> {
    type: NodeType = 'folder'
    children: {
        [key: string]: Node<TResource> | Folder<TResource>
    } = {}

    folder(...path: string[]): Folder<TResource> {
        const folder = new Folder()
        let childFolder = folder

        let children: string[] = []
        let childName = ''

        childName = path.shift() as string
        const child = this.children[childName]
        if (isFolder(child)) {
            return child.folder(...path)
        }

        if (childName) {
            children = path
        }

        if (children.length !== 0) {
            for (const p of children) {
                childFolder = childFolder.folder(p)
            }
        }

        this.children[childName] = folder
        return childFolder
    }

    node(path: string | string[], content: ResourceFiles<TResource>): void {
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
            this.children[path] = newNode(content)
        }
    }

    get(...path: string[]): Folder<TResource> | Node<TResource> | undefined {
        const p = path.shift()
        if (p === undefined) {
            return undefined
        }

        let node = this.children[p]
        for (const subPath of path) {
            if (isFolder(node)) {
                node = node.children[subPath]
            } else {
                break
            }
        }
        return node
    }
}

export class Node<TResource extends string> {
    type: NodeType = 'node'
    files: ResourceFiles<TResource>

    constructor(files: ResourceFiles<TResource>) {
        this.files = files
    }
}

interface BaseResource<TResourceFiles extends readonly string[]> {
    path: string
    filePaths: TResourceFiles
}

export class NodeResource<const TResourceFiles extends readonly string[]>
    extends Node<TResourceFiles[number]>
    implements BaseResource<TResourceFiles>
{
    path: string
    filePaths: TResourceFiles

    constructor(path: string, filePaths: TResourceFiles) {
        const files: any = {}
        for (const path of filePaths.keys()) {
            files[path] = ''
        }
        super(files)
        this.path = path
        this.filePaths = filePaths
    }
}

export class FolderResource<const TResourceFiles extends readonly string[]>
    extends Folder<TResourceFiles[number]>
    implements BaseResource<TResourceFiles>
{
    path: string
    filePaths: TResourceFiles

    constructor(path: string, filePaths: TResourceFiles) {
        super()
        this.path = path
        this.filePaths = filePaths
    }
}

export function isFolder<TResource extends string>(
    resource: Folder<TResource> | Node<TResource>
): resource is Folder<TResource> {
    return (resource as Folder<TResource>)?.type == 'folder'
}

export function isNode<TResource extends string>(
    node: Folder<TResource> | Node<TResource>
): node is Node<TResource> {
    return (node as Node<TResource>)?.type == 'node'
}

export function newFolder<T extends string>(): Folder<T> {
    return new Folder<T>()
}
export function newNode<T extends string>(files: ResourceFiles<T>): Node<T> {
    return new Node<T>(files)
}

export const newNodeResource = function <
    const TResourceFiles extends readonly string[]
>(path: string, filePaths: TResourceFiles) {
    return new NodeResource(path, filePaths)
}

export const newFolderResource = function <
    const TResourceFiles extends readonly string[]
>(path: string, filePaths: TResourceFiles) {
    return new FolderResource(path, filePaths)
}

export const newModule = function <T>(path: string, resources: T) {
    return {
        path,
        resources,
    }
}
