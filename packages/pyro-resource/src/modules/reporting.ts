import { newModule, newFolderResource } from '../resources'

const report = newFolderResource<{ 'data.bin': any }>('reports', {
    scope: 'G',
    version: 1,
})

export const reporting = newModule('com.inductiveautomation.reporting', {
    report,
})
