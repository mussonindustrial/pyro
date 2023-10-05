import { newNodeResource } from '../../resources'

export const generalProperties = newNodeResource<{ 'data.bin': any }>(
    'general-properties',
    { scope: 'G', version: 1 }
)
