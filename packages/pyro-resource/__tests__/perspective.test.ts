import { it, expect } from 'vitest'
import fs from 'fs'
import { Folder, newProject, perspective, vision } from '../src'

function getProject() {
    return newProject({ perspective, vision })
}

function getPerspective() {
    return getProject().perspective
}

function emptyStyle() {
    return JSON.stringify({
        base: {
            style: {
                color: '#fffff',
            },
        },
    })
}

function addExampleStyleClasses(p: typeof perspective) {

    p.resources.styleClasses.node('top-level-psc', {
        'style.json': emptyStyle(),
    })

    p.resources.styleClasses.folder('Folder').node('PSC-In-Folder', {
        'style.json': emptyStyle(),
    })

    p.resources.styleClasses.node('Folder/Folder2/PSC-in-Nested-Folder', {
        'style.json': emptyStyle(),
    })
    
    p.resources.pageConfig.files = {
        'config.json': 'test',
    }
    return p
}

it('should contain perspective module', async () => {
    expect(getProject().perspective).toBeDefined()
})

it('should have correct perspective module path', async () => {
    expect(getPerspective().path).toBe('com.inductiveautomation.perspective')
})

it('should allow for style-class definitions', async () => {
    const p = addExampleStyleClasses(getPerspective())

    expect(
        JSON.stringify((p.resources.styleClasses.get('Folder/Folder2') as Folder<'style.json'>).children)
    ).toStrictEqual(JSON.stringify({
        'PSC-in-Nested-Folder': {
            type: 'node',
            files: {
                'style.json': emptyStyle(),
            },
        },
    }))
})

// it('should perform a zip', async () => {
//     const p = getProject()
//     addExampleStyleClasses(p.perspective)
//     const zip = await p.zip()
//     fs.writeFileSync('./__tests__/perspective.zip', zip)
// })
