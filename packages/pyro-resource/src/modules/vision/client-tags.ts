import { newNodeResource } from '../../resources'

export const clientTags = newNodeResource<{ 'data.bin': any }>('client-tags', {
    scope: 'G',
    version: 1,
})
