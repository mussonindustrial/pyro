import { newModule, newFolderResource } from '../resources'

const transactionGroups = newFolderResource('transaction-groups', ['data.bin'])

export const sqlBridge = newModule('com.inductiveautomation.sqlbridge', {
    transactionGroups,
})
