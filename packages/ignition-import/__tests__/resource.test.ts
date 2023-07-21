import { it, expect } from 'vitest'
import { newFolderResource, newProject, perspective } from '../src'
import JSZip from 'jszip'


function newTestFolderResource() {
    return newFolderResource('test-resource', ['test.json'])
}

// it('should produce expected checksum', async () => {
//     const project = newProject({ perspective })

//     project.perspective.resources.styleClasses.node('StyleClass', {
//         'style.json': JSON.stringify({ base: { style: {} } }, null, 4),
//     })


//     const zip = await JSZip.loadAsync(await project.zip())
//     const resource = await zip
//         .folder(perspective.path)
//         ?.folder(perspective.resources.styleClasses.path)
//         ?.file('StyleClass/resource.json')
//         ?.async('string')

//     console.log(resource)

//     expect(JSON.parse(resource!).attributes.lastModificationSignature).toMatchInlineSnapshot()
// })

it('should support folder creation', async () => {
    const resource = newTestFolderResource()
    resource.folder('Test Folder')

    expect(resource.content['Test Folder']).toBeDefined()
    expect(resource.content['Test Folder'].content).toStrictEqual({})
})

it('should support nested folder creation', async () => {
    const resource = newTestFolderResource()
    resource.folder('Test Folder', 'Nested Folder')

    expect(resource.content['Test Folder'].content['Nested Folder']).toBeDefined()
    expect(resource.content['Nested Folder']).toBeUndefined()
})

it('should support node creation', async () => {
    const resource = newTestFolderResource()
    resource.node('Test Node', {'test.json': 'test-value'})

    expect(resource.content['Test Node'].content['test.json']).toStrictEqual('test-value')
})

it('should support node creation using array', async () => {
    const resource = newTestFolderResource()
    resource.node(['Test Node'], {'test.json': 'test-value'})

    expect(resource.content['Test Node'].content['test.json']).toStrictEqual('test-value')
})

it('should support node creation using folder paths', async () => {
    const resource = newTestFolderResource()
    resource.node(['Test Folder', 'Test Node'], {'test.json': 'test-value'})

    expect(resource.content['Test Folder'].content['Test Node'].content['test.json']).toStrictEqual('test-value')
})

it('should support node creation using deep folder paths', async () => {
    const resource = newTestFolderResource()
    resource.node(['Test Folder', 'Nested Folder', 'Test Node'], {'test.json': 'test-value'})

    expect(resource.content['Test Folder'].content['Nested Folder'].content['Test Node'].content['test.json']).toStrictEqual('test-value')
})