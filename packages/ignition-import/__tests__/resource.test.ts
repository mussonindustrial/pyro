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

    expect(JSON.parse(resource!).attributes.lastModificationSignature).toEqual(
        '469a4d209743a8ac22aa87d150af6ef7b95b2818fee0ef805d13f70c6952b14c'
    )
})
