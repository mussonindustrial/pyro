import { newNodeResource } from '../../resources'

export const launchProperties = newNodeResource<{ 'data.bin': any }>(
    'launch-properties',
    { scope: 'G', version: 1 }
)