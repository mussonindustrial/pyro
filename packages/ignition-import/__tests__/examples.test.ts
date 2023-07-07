import { it, expect } from 'vitest'
import fs from 'fs'
import {
    newFolderResource,
    newModule,
    newNode,
    newNodeResource,
    newProject,
    perspective,
    vision,
} from 'ignition-import'

it('example1', async () => {
    const project = newProject({ perspective })
    project.perspective.resources.styleClasses.content = newNode(
        'MyStyleClass',
        { style: { base: { style: {} } } }
    )

    const zip = await project.zip()
    // fs.writeFileSync('./__tests__/project-import.zip', zip)
})

it('custom module definition', async () => {
    const myFolderResource = newFolderResource('my-resource', {
        file: 'file.json',
    })

    const mySingletonResource = newNodeResource('my-singleton-resource', {
        file: 'file.json',
        image: 'image.png',
        anotherFile: 'another.xml',
    })

    const myModule = newModule('com.acme.module', {
        myFolderResource,
        mySingletonResource,
    })

    const project = newProject({ myModule })

    project.myModule.resources
    // (property) resources: {
    //     myFolderResource: FolderResource<{
    //         file: string;
    //     }>;
    //     mySingletonResource: NodeResource<{
    //         file: string;
    //         image: string;
    //         anotherFile: string;
    //     }>;
    // }
})

it('page config', async () => {
    const project = newProject({ perspective })
    const pageConfig = project.perspective.resources.pageConfig
    pageConfig.content = {
        config: {
            pages: {
                '/': {
                    title: 'Title',
                    viewPath: 'View',
                },
            },
            sharedDocks: {
                cornerPriority: 'top-bottom',
                left: [
                    {
                        anchor: 'fixed',
                        autoBreakpoint: 800,
                        content: 'auto',
                        handle: 'hide',
                        iconUrl: '',
                        id: 'left',
                        modal: false,
                        resizable: false,
                        show: 'visible',
                        size: 300,
                        viewParams: {},
                        viewPath: 'Components/Nav/LeftNav',
                    },
                ],
                right: [
                    {
                        anchor: 'fixed',
                        autoBreakpoint: 1000,
                        content: 'auto',
                        handle: 'hide',
                        iconUrl: '',
                        id: 'faceplate',
                        modal: false,
                        resizable: false,
                        show: 'visible',
                        size: 300,
                        viewParams: {},
                        viewPath:
                            'Components/Dock/FaceplateContainer/FaceplateContainer',
                    },
                ],
                top: [
                    {
                        anchor: 'fixed',
                        autoBreakpoint: 480,
                        content: 'push',
                        handle: 'hide',
                        iconUrl: '',
                        id: '',
                        modal: false,
                        resizable: false,
                        show: 'visible',
                        size: 65,
                        viewParams: {},
                        viewPath: 'Components/Nav/TopNav',
                    },
                ],
            },
        },
    }
    const zip = await project.zip()
    fs.writeFileSync('./__tests__/output/pageConfig.zip', zip)
})
