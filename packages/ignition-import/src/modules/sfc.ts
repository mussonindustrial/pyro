import { newModule, newFolderResource } from '../resources'

const charts = newFolderResource('charts', {
    sfc: 'sfc.xml',
})

export const sfc = newModule('com.inductiveautomation.sfc', {
    charts,
})
