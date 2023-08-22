import { newModule, newFolderResource } from '../resources'

const charts = newFolderResource('charts', ['sfc.xml'])

export const sfc = newModule('com.inductiveautomation.sfc', {
    charts,
})
