import { it, expect } from 'vitest'
import { newNode, newProject, perspective } from '../src'
import JSZip from 'jszip'

it('should produce expected checksum', async () => {
    const project = newProject({ perspective })
    project.perspective.resources.styleClasses.content = newNode('StyleClass', {
        style: { base: { style: {} } },
    })

    const zip = await JSZip.loadAsync(await project.zip())
    const resource = await zip
        .folder(perspective.path)
        ?.folder(perspective.resources.styleClasses.path)
        ?.file('StyleClass/resource.json')
        ?.async('string')

    console.log(resource)

    // expect(JSON.parse(resource!).attributes.lastModificationSignature).toMatchInlineSnapshot(
    // '"60b3ec24f97a14fd5093ad49b9eb045cb41589214e8d301c057f4d7eec035818"')
})
