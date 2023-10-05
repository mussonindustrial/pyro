import { newNodeResource } from '../../resources'

export const designerProperties = newNodeResource<{ 'data.bin': any }>(
    'designer-properties',
    { scope: 'D', version: 1 }
)
