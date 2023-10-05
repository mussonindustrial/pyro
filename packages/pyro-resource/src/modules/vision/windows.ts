import { newFolderResource } from '../../resources'

export const window = newFolderResource<{ 'window.bin': any; 'thumbnail.png': any }>(
    'windows',
    { scope: 'G', version: 1 }
)
