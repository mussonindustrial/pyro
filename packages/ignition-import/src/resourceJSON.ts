import { ResourceInstance } from './resources'
import JSZip from 'jszip'
import { newResource } from 'ignition-resource-json'

export async function createResourceJson<T>(
    filePaths: ResourceInstance<T>,
    folder: JSZip
) {
    let files = {}
    for (const path of Object.values(filePaths)) {
        if (typeof path === 'string') {
            files = {
                ...files,
                [path]: await folder.file(path)?.async('nodebuffer'),
            }
        }
    }
    const resource = await newResource({}, files)
    const content = JSON.stringify(resource.props, null, 2)
    folder.file('resource.json', content)
}
