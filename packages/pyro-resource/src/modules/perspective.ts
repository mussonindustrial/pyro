import { newModule, newFolderResource, newNodeResource } from '../resources'

const generalProperties = newNodeResource('general-properties', ['data.bin'])

const pageConfig = newNodeResource('page-config', ['config.json'])

const sessionProperties = newNodeResource('session-props', ['props.json'])

const sessionScripts = newNodeResource('session-scripts', ['data.bin'])

const styleClasses = newFolderResource('style-classes', ['style.json'])

const views = newFolderResource('views', ['view.json', 'thumbnail.png'])

export const perspective = newModule('com.inductiveautomation.perspective', {
    generalProperties,
    pageConfig,
    sessionProperties,
    sessionScripts,
    styleClasses,
    views,
})
