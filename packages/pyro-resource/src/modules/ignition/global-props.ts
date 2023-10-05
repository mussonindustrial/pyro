import { newNodeResource } from '../../resources'

export const globalProperties = newNodeResource<{ 'data.bin': any }>(
    'global-props',
    { scope: 'A', version: 1 }
)
