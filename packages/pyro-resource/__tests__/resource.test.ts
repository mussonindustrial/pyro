import { it, expect } from 'vitest'
import { Folder, Node, newFolderResource } from '../src'


function newTestFolderResource() {
    return newFolderResource<{'test.json': any}>('test-resource', { scope: 'A', version: 1 })
}

it('should support folder creation', async () => {
    const resource = newTestFolderResource()
    resource.folder('Test Folder')

    expect(resource.children['Test Folder']).toBeDefined()
    expect((resource.get('Test Folder') as Folder<{'test.json': any}, {}>).children).toStrictEqual({})
})

it('should support nested folder creation', async () => {
    const resource = newTestFolderResource()
    resource.folder('Test Folder/Nested Folder')

    expect(resource.children['Nested Folder']).toBeUndefined()
    expect(resource.get('Test Folder/Nested Folder')).toBeDefined()

})

it('should support node creation', async () => {
    const resource = newTestFolderResource()
    resource.node('Test Node', {'test.json': 'test-value'})

    expect((resource.get('Test Node') as Node<{'test.json': any}, {}>).files['test.json']).toStrictEqual('test-value')
})

it('should support node creation using folder paths', async () => {
    const resource = newTestFolderResource()
    resource.node('Test Folder/Test Node', {'test.json': 'test-value'})

    expect((resource.get('Test Folder/Test Node') as Node<{'test.json': any}, {}>).files['test.json']).toStrictEqual('test-value')
})

it('should support node creation using deep folder paths', async () => {
    const resource = newTestFolderResource()
    resource.node('Test Folder/Nested Folder/Test Node', {'test.json': 'test-value'})

    expect((resource.get('Test Folder/Nested Folder/Test Node') as Node<{'test.json': any}, {}>).files['test.json']).toStrictEqual('test-value')
})