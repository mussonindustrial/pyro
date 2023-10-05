import { newModule, newFolderResource } from '../resources'

const chart = newFolderResource<{ 'sfc.xml': any }>('charts', {
    scope: 'G',
    version: 1,
})

export const sfc = newModule('com.inductiveautomation.sfc', {
    chart,
})
