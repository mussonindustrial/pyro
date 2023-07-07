import { newModule, newFolderResource } from '../resources'

const transactionGroups = newFolderResource('transaction-groups', {
    data: 'data.bin',
})

export const sqlBridge = newModule('com.inductiveautomation.sqlbridge', {
    transactionGroups,
})
