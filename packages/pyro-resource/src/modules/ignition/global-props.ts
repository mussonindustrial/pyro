import { newNodeResource } from '../../resources'

export const pythonScript = newNodeResource<{ 'data.bin': any }>(
    'global-props',
    { scope: 'A', version: 1 }
)
