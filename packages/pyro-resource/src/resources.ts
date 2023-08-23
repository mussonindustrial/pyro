import { ResourceFiles } from '@mussonindustrial/pyro-resource-signature'

export type NodeType = 'folder' | 'node'

export class Folder<TResource extends string> {
    type: NodeType = 'folder'
    children: {
        [key: string]: Node<TResource> | Folder<TResource> | undefined
    } = {}
    delimiter = '/'

    folder(path: string): Folder<TResource> {
        const pathSegments = path.split(this.delimiter)

        let f: Folder<TResource> = this
        for (const pathSegment of pathSegments) {
            let child = f.children[pathSegment]
            if (child === undefined) {
                child = new Folder()
                f.children[pathSegment] = child
            }
            if (isFolder(child)) {
                f = child
            } else {
                throw new Error(
                    `found non-folder object at position '${pathSegment}' of folder path '${path}'`
                )
            }
        }

        return f
    }

    node(path: string, content: ResourceFiles<TResource>): void {
        const pathSegments = path.split(this.delimiter)
        const nodeName = pathSegments.pop()!

        if (pathSegments.length > 0) {
            const folderPath = pathSegments.join(this.delimiter)
            this.folder(folderPath).node(nodeName, content)
        } else {
            this.children[nodeName] = newNode(content)
        }
    }

    get(path: string): Folder<TResource> | Node<TResource> | undefined {
        const pathSegments = path.split(this.delimiter)

        let item: Folder<TResource> | Node<TResource> = this
        for (const pathSegment of pathSegments) {
            if (isFolder(item)) {
                let child: Folder<TResource> | Node<TResource> | undefined =
                    item.children[pathSegment]
                if (child === undefined) {
                    return undefined
                } else {
                    item = child
                }
            } else {
                throw Error(
                    `found non-folder object at position '${pathSegment}' of folder path '${path}'`
                )
            }
        }
        return item
    }
}

export class Node<TResource extends string> {
    type: NodeType = 'node'
    files: ResourceFiles<TResource>

    constructor(files: ResourceFiles<TResource>) {
        this.files = files
    }

    set(content: ResourceFiles<TResource>): void {
        this.files = content
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

function newFolder<T extends string>(): Folder<T> {
    return new Folder<T>()
}
function newNode<T extends string>(files: ResourceFiles<T>): Node<T> {
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
