import { newNodeResource } from '../../resources'

export const uiProperties = newNodeResource<{ 'data.bin': any }>('ui-properties', {
    scope: 'G',
    version: 1,
})
