import JSZip from 'jszip'
import { newResource } from 'ignition-resource-json'

export async function createResourceJson<
    const TResourceFiles extends readonly string[]
>(filePaths: TResourceFiles, folder: JSZip) {
    let files = {}
    for (const path of filePaths) {
        files = {
            ...files,
            [path]: await folder.file(path)?.async('nodebuffer'),
        }
    }
    const resource = await newResource({}, files)
    const content = JSON.stringify(resource.props, null, 2)
    folder.file('resource.json', content)
}
