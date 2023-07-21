import JSZip from 'jszip'
import { ResourceFiles, newResource } from 'ignition-resource-json'

export async function createResourceJson<T extends string>(
    filePaths: ResourceFiles<T>,
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
