import {
    InstanceDefinedProps,
    ResourceDefinedProps,
} from '@mussonindustrial/pyro-resource-signature'

export type NodeType = 'folder' | 'node'

export type ResourceInstanceProps<TAttributes> = Partial<
    InstanceDefinedProps & { attributes: TAttributes }
>

export class Folder<TResource, TAttributes> {
    type: NodeType = 'folder'
    children: {
        [key: string]:
            | Node<TResource, TAttributes>
            | Folder<TResource, TAttributes>
            | undefined
    } = {}
    delimiter = '/'

    folder(path: string): Folder<TResource, TAttributes> {
        const pathSegments = path.split(this.delimiter)

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let f: Folder<TResource, TAttributes> = this
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

    node(
        path: string,
        content: TResource,
        props?: ResourceInstanceProps<TAttributes>
    ): void {
        const pathSegments = path.split(this.delimiter)
        const nodeName = pathSegments.pop()!

        if (pathSegments.length > 0) {
            const folderPath = pathSegments.join(this.delimiter)
            this.folder(folderPath).node(nodeName, content, props)
        } else {
            this.children[nodeName] = newNode(content, props)
        }
    }

    get(
        path: string
    ):
        | Folder<TResource, TAttributes>
        | Node<TResource, TAttributes>
        | undefined {
        const pathSegments = path.split(this.delimiter)

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let item:
            | Folder<TResource, TAttributes>
            | Node<TResource, TAttributes> = this
        for (const pathSegment of pathSegments) {
            if (isFolder(item)) {
                const child:
                    | Folder<TResource, TAttributes>
                    | Node<TResource, TAttributes>
                    | undefined = item.children[pathSegment]
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

export class Node<TResource, TAttributes> {
    type: NodeType = 'node'
    files: TResource
    props?: ResourceInstanceProps<TAttributes>

    constructor(files: TResource, props?: ResourceInstanceProps<TAttributes>) {
        this.files = files
        this.props = props
    }

    set(content: TResource, props?: ResourceInstanceProps<TAttributes>): void {
        this.files = content
        this.props = props
    }
}

interface BaseResource<TResource, TAttributes> {
    path: string
    rootProps: ResourceDefinedProps
    getDefaultAttributes?: DefaultAttributeProvider<
        Node<TResource, TAttributes>,
        TAttributes
    >

    setDefaultAttributeProvider(
        fn: DefaultAttributeProvider<Node<TResource, TAttributes>, TAttributes>
    ): void
}

export class NodeResource<TResource, TAttributes>
    extends Node<TResource, TAttributes>
    implements BaseResource<TResource, TAttributes>
{
    path: string
    rootProps: ResourceDefinedProps
    getDefaultAttributes?: DefaultAttributeProvider<
        Node<TResource, TAttributes>,
        TAttributes
    >

    constructor(
        path: string,
        rootProps: ResourceDefinedProps,
        getDefaultAttributes?: DefaultAttributeProvider<
            Node<TResource, TAttributes>,
            TAttributes
        >
    ) {
        const files: any = {}
        super(files)
        this.path = path
        this.rootProps = rootProps
        this.getDefaultAttributes = getDefaultAttributes
    }

    setDefaultAttributeProvider(
        fn: DefaultAttributeProvider<Node<TResource, TAttributes>, TAttributes>
    ) {
        this.getDefaultAttributes = fn
    }
}

export class FolderResource<TResource, TAttributes>
    extends Folder<TResource, TAttributes>
    implements BaseResource<TResource, TAttributes>
{
    path: string
    rootProps: ResourceDefinedProps
    getDefaultAttributes?: DefaultAttributeProvider<
        Node<TResource, TAttributes>,
        TAttributes
    >

    constructor(
        path: string,
        rootProps: ResourceDefinedProps,
        getDefaultAttributes?: DefaultAttributeProvider<
            Node<TResource, TAttributes>,
            TAttributes
        >
    ) {
        super()
        this.path = path
        this.rootProps = rootProps
        this.getDefaultAttributes = getDefaultAttributes
    }

    setDefaultAttributeProvider(
        fn: DefaultAttributeProvider<Node<TResource, TAttributes>, TAttributes>
    ) {
        this.getDefaultAttributes = fn
    }
}

type DefaultAttributeProvider<TResource, TAttributes = object> = {
    (resource: TResource): TAttributes
}

function newFolder<TResource, TAttributes>(): Folder<TResource, TAttributes> {
    return new Folder()
}
function newNode<TResource, TAttributes>(
    files: TResource,
    props?: ResourceInstanceProps<TAttributes>
): Node<TResource, TAttributes> {
    return new Node(files, props)
}

export function newNodeResource<TResource, TAttributes = object>(
    path: string,
    rootProps: ResourceDefinedProps,
    getDefaultAttributes?: DefaultAttributeProvider<
        Node<TResource, TAttributes>,
        TAttributes
    >
) {
    return new NodeResource<TResource, TAttributes>(
        path,
        rootProps,
        getDefaultAttributes
    )
}

export function newFolderResource<TResource, TAttributes = object>(
    path: string,
    rootProps: ResourceDefinedProps,
    getDefaultAttributes?: DefaultAttributeProvider<
        Node<TResource, TAttributes>,
        TAttributes
    >
) {
    return new FolderResource<TResource, TAttributes>(
        path,
        rootProps,
        getDefaultAttributes
    )
}

export const newModule = function <T>(path: string, resources: T) {
    return {
        path,
        resources,
    }
}

export function isFolder<TResource, TAttributes>(
    resource: Folder<TResource, TAttributes> | Node<TResource, TAttributes>
): resource is Folder<TResource, TAttributes> {
    return (resource as Folder<TResource, TAttributes>)?.type == 'folder'
}

export function isNode<TResource, TAttributes>(
    node: Folder<TResource, TAttributes> | Node<TResource, TAttributes>
): node is Node<TResource, TAttributes> {
    return (node as Node<TResource, TAttributes>)?.type == 'node'
}
