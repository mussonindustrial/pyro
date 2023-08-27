import { newModule, newFolderResource } from '../resources'

const resources = newFolderResource<{ 
    'config.json': any
    'doDelete.py': any
    'doGet.py': any
    'doHead.py': any
    'doOptions.py': any
    'doPatch.py': any
    'doPost.py': any
    'doPut.py': any
    'doTrace.py': any
    }>('resources', {
    scope: 'G',
    version: 1,
})

export const webdev = newModule('com.inductiveautomation.webdev', {
    resources,
})
