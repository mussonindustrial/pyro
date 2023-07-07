import { newModule, newFolderResource, newNodeResource } from '../resources'

const generalProperties = newNodeResource('general-properties', {
    data: 'data.bin',
})

const pageConfig = newNodeResource('page-config', {
    config: 'config.json',
})

const sessionProperties = newNodeResource('session-props', {
    props: 'props.json',
})

const sessionScripts = newNodeResource('session-scripts', {
    data: 'data.bin',
})

const styleClasses = newFolderResource('style-classes', {
    style: 'style.json',
})

const views = newFolderResource('views', {
    view: 'view.json',
    thumbnail: 'thumbnail.png',
})

export const perspective = newModule('com.inductiveautomation.perspective', {
    generalProperties,
    pageConfig,
    sessionProperties,
    sessionScripts,
    styleClasses,
    views,
})
