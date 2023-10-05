import { newNodeResource } from '../../resources'

export const clientEventScripts = newNodeResource<{ 'data.bin': any }>(
    'client-event-scripts',
    { scope: 'G', version: 1 }
)
