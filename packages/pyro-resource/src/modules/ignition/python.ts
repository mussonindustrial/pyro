import { newFolderResource } from '../../resources'

export const pythonScript = newFolderResource<{'code.py': any}>(
    'script-python',
    { scope: 'A', version: 1 }
)
