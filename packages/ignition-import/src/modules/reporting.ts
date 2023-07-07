import { newModule, newFolderResource } from '../resources'

const reports = newFolderResource('reports', {
    data: 'data.bin',
})

export const reporting = newModule('com.inductiveautomation.reporting', {
    reports,
})
