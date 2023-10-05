import { newModule, newFolderResource } from '../resources'

const transactionGroup = newFolderResource<{ 'data.bin': any }>(
    'transaction-groups',
    { scope: 'G', version: 1 }
)

export const sqlBridge = newModule('com.inductiveautomation.sqlbridge', {
    transactionGroup,
})
