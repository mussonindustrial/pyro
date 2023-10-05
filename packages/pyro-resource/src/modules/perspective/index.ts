import { newModule, newFolderResource, newNodeResource } from '../../resources'
import { styleClass } from './styles-classes'

const generalProperties = newNodeResource<{ 'data.bin': any }>(
    'general-properties',
    { scope: 'G', version: 1 }
)

const pageConfig = newNodeResource<{ 'config.json': any }>('page-config', {
    scope: 'G',
    version: 1,
})

const sessionProperties = newNodeResource<{ 'props.json': any }>(
    'session-props',
    { scope: 'G', version: 1 }
)

const sessionScripts = newNodeResource<{ 'data.bin': any }>('session-scripts', {
    scope: 'G',
    version: 1,
})

const view = newFolderResource<{ 'view.json': any; 'thumbnail.png'?: any }>(
    'views',
    { scope: 'G', version: 1 }
)

export const perspective = newModule('com.inductiveautomation.perspective', {
    generalProperties,
    pageConfig,
    sessionProperties,
    sessionScripts,
    styleClass,
    view,
})
export default perspective