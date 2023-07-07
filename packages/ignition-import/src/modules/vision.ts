import { newModule, newFolderResource, newNodeResource } from '../resources'

const clientEventScripts = newNodeResource('client-event-scripts', {
    data: 'data.bin',
})

const clientTags = newNodeResource('client-tags', {
    data: 'data.bin',
})

const designerProperties = newNodeResource('designer-properties', {
    data: 'data.bin',
})

const generalProperties = newNodeResource('general-properties', {
    data: 'data.bin',
})

const launchProperties = newNodeResource('launch-properties', {
    data: 'data.bin',
})

const loginProperties = newNodeResource('login-properties', {
    data: 'data.bin',
})

const templates = newFolderResource('templates', {
    data: 'data.bin',
})

const uiProperties = newNodeResource('ui-properties', {
    data: 'data.bin',
})

const windows = newFolderResource('windows', {
    window: 'window.bin',
    thumbnail: 'thumbnail.png',
})

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
