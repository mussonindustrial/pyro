import { newNodeResource } from '../../resources'

export const designerProperties = newNodeResource<{ 'data.bin': any }>(
    'designer-properties',
    { scope: 'G', version: 1 }
)