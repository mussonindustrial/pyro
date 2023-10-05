import { newNodeResource } from '../../resources'

export const loginProperties = newNodeResource<{ 'data.bin': any }>(
    'login-properties',
    { scope: 'G', version: 1 }
)