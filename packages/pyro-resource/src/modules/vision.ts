import { newModule, newFolderResource, newNodeResource } from '../resources'

const clientEventScripts = newNodeResource<{ 'data.bin': any }>(
    'client-event-scripts',
    { scope: 'G', version: 1 }
)

const clientTags = newNodeResource<{ 'data.bin': any }>('client-tags', {
    scope: 'G',
    version: 1,
})

const designerProperties = newNodeResource<{ 'data.bin': any }>(
    'designer-properties',
    { scope: 'G', version: 1 }
)

const generalProperties = newNodeResource<{ 'data.bin': any }>(
    'general-properties',
    { scope: 'G', version: 1 }
)

const launchProperties = newNodeResource<{ 'data.bin': any }>(
    'launch-properties',
    { scope: 'G', version: 1 }
)

const loginProperties = newNodeResource<{ 'data.bin': any }>(
    'login-properties',
    { scope: 'G', version: 1 }
)

const templates = newFolderResource<{ 'data.bin': any }>('templates', {
    scope: 'G',
    version: 1,
})

const uiProperties = newNodeResource<{ 'data.bin': any }>('ui-properties', {
    scope: 'G',
    version: 1,
})

const windows = newFolderResource<{ 'window.bin': any; 'thumbnail.png': any }>(
    'windows',
    { scope: 'G', version: 1 }
)

export const vision = newModule('com.inductiveautomation.vision', {
    clientEventScripts,
    clientTags,
    designerProperties,
    generalProperties,
    launchProperties,
    loginProperties,
    templates,
    uiProperties,
    windows,
})
