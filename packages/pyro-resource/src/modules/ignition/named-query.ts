import { Node, newFolderResource } from '../../resources'

type NamedQueryAttributes = {
    useMaxReturnSize?: boolean
    autoBatchEnabled?: boolean
    fallbackValue?: string
    maxReturnSize?: number
    cacheUnit?: 'SEC'
    type?: 'Query'
    enabled?: boolean
    cacheAmount?: number
    cacheEnabled?: boolean
    database?: string
    fallbackEnabled?: boolean
    permissions?: NamedQueryPermission[]
    parameters?: NamedQueryParameter[]
}

type NamedQueryPermission = {
    zone: string
    role: string
}

type NamedQueryParameter = {
    type: 'Parameter'
    identifier: string
    sqlType: number
}

type NamedQueryFiles = {
    'query.sql': any
}

function getDefaultAttributes(
    resource: Node<NamedQueryFiles, NamedQueryAttributes>
): NamedQueryAttributes {
    return {
        useMaxReturnSize: false,
        autoBatchEnabled: false,
        fallbackValue: '',
        maxReturnSize: 100,
        cacheUnit: 'SEC',
        type: 'Query',
        enabled: true,
        cacheAmount: 1,
        cacheEnabled: false,
        database: '',
        fallbackEnabled: false,
        permissions: [{ zone: '', role: '' }],
        parameters: [],
    }
}

export const namedQuery = newFolderResource<
    NamedQueryFiles,
    NamedQueryAttributes
>('named-query', { scope: 'DG', version: 2 }, getDefaultAttributes)
