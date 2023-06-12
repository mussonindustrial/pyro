import { it, expect } from 'vitest'
import { createBuilder } from '../src'
import { PerspectiveModule } from '../src/resources/perspective'

function getPerspective(): PerspectiveModule {
    return createBuilder().project.perspective
}

function addExampleStyleClasses(
    perspective: PerspectiveModule
): PerspectiveModule {
    perspective.resources.styleClasses.root = { children: {} }
    perspective.resources.styleClasses.root.children = {
        'Top Level PSC': {
            content: {
                style: {},
            },
        },
        'Folder 1': {
            children: {
                'PSC In Folder': {
                    content: {
                        style: {},
                    },
                },
                'Folder 2': {
                    children: {
                        'PSC in Nested Folder': {
                            content: {
                                style: {},
                            },
                        },
                    },
                },
            },
        },
    }
    return perspective
}

it('should contain perspective module', async () => {
    const builder = createBuilder()
    expect(builder.project.perspective).toBeDefined()
})

it('should have correct perspective module path', async () => {
    expect(getPerspective().path).toBe('com.inductiveautomation.perspective')
})

it('should allow for style-class definitions', async () => {
    const perspective = addExampleStyleClasses(getPerspective())
    console.log(perspective)
    expect(
        perspective.resources.styleClasses.root?.children['Folder 1'].children[
            'Folder 2'
        ].children
    ).toStrictEqual({
        'PSC in Nested Folder': {
            content: {
                style: {},
            },
        },
    })
})
