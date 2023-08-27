import JSZip from 'jszip'
import {
    ResourceFiles,
    newResource,
} from '@mussonindustrial/pyro-resource-signature'
import { FolderResource, Node, NodeResource } from './resources'

export async function createResourceJson<TResource, TProps>(
    folder: JSZip,
    root: FolderResource<TResource, TProps> | NodeResource<TResource, TProps>,
    resource: Node<TResource, TProps>
) {
    const filePaths = Object.keys(resource.files as {})
    let files = {}
    for (const path of filePaths) {
        files = {
            ...files,
            [path]: await folder.file(path)?.async('nodebuffer'),
        }
    }
    const allProps = {
        ...root.rootProps,
        ...resource.props,
        attributes: {
            ...resource.props?.attributes,
            ...root.getDefaultAttributes?.call(root, resource),
        },
    }
    const resourceJson = await newResource(
        allProps,
        files as ResourceFiles<any>
    )
    const content = JSON.stringify(resourceJson.props, null, 2)
    folder.file('resource.json', content)
}
