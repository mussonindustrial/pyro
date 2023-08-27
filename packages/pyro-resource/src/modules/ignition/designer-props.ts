import { newNodeResource } from '../../resources'

export const pythonScript = newNodeResource<{ 'data.bin': any }>(
    'designer-properties',
    { scope: 'D', version: 1 }
)
