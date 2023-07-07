import { newModule, newFolderResource } from '../resources'

const resources = newFolderResource('resources', {
    data: 'data.bin',
})

export const webdev = newModule('com.inductiveautomation.webdev', {
    resources,
})
