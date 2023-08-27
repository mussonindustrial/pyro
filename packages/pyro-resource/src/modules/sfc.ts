import { newModule, newFolderResource } from '../resources'

const charts = newFolderResource<{ 'sfc.xml': any }>('charts', {
    scope: 'G',
    version: 1,
})

export const sfc = newModule('com.inductiveautomation.sfc', {
    charts,
})
