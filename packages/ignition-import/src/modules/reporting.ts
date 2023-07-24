import { newModule, newFolderResource } from '../resources'

const reports = newFolderResource('reports', ['data.bin'])

export const reporting = newModule('com.inductiveautomation.reporting', {
    reports,
})
