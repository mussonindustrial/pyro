import {  newFolderResource } from '../../resources'

export const template = newFolderResource<{ 'data.bin': any }>('templates', {
    scope: 'G',
    version: 1,
})