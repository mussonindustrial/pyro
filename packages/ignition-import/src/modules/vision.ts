import { newModule, newFolderResource, newNodeResource } from '../resources'

const clientEventScripts = newNodeResource('client-event-scripts', ['data.bin'])

const clientTags = newNodeResource('client-tags', ['data.bin'])

const designerProperties = newNodeResource('designer-properties', ['data.bin'])

const generalProperties = newNodeResource('general-properties', ['data.bin'])

const launchProperties = newNodeResource('launch-properties', ['data.bin'])

const loginProperties = newNodeResource('login-properties', ['data.bin'])

const templates = newFolderResource('templates', ['data.bin'])

const uiProperties = newNodeResource('ui-properties', ['data.bin'])

const windows = newFolderResource('windows', ['window.bin', 'thumbnail.png'])

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
