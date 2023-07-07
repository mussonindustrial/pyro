import { it, expect } from 'vitest'
import fs from 'fs'
import { newNode, newProject, perspective, vision } from 'ignition-import'

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
    p.resources.styleClasses.content = {
        'top-level-psc': {
            type: 'node',
            content: {
                style: emptyStyle(),
            },
        },
        Folder: {
            type: 'folder',
            content: {
                'PSC-In-Folder': {
                    type: 'node',
                    content: {
                        style: emptyStyle(),
                    },
                },
                Folder2: {
                    type: 'folder',
                    content: {
                        'PSC-in-Nested-Folder': {
                            type: 'node',
                            content: {
                                style: emptyStyle(),
                            },
                        },
                    },
                },
            },
        },
    }
    p.resources.pageConfig.content = {
        config: 'test',
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
    console.log(p)
    expect(
        p.resources.styleClasses.content.Folder.content.Folder2.content
    ).toStrictEqual({
        'PSC-in-Nested-Folder': {
            type: 'node',
            content: {
                style: emptyStyle(),
            },
        },
    })
})

// it('should perform a zip', async () => {
//     const p = getProject()
//     addExampleStyleClasses(p.perspective)
//     const zip = await p.zip()
//     fs.writeFileSync('./__tests__/perspective.zip', zip)
// })
