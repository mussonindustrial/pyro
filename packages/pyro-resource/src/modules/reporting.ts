import { newModule, newFolderResource } from '../resources'

const reports = newFolderResource<{ 'data.bin': any }>('reports', {
    scope: 'G',
    version: 1,
})

export const reporting = newModule('com.inductiveautomation.reporting', {
    reports,
})
