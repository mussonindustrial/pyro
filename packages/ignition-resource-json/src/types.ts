export type Scope = 'N' | 'G' | 'D' | 'C' | 'A'

export const ScopePrimitives = {
    N: 0,
    G: 1,
    D: 2,
    C: 4,
    A: 7,
} as const

export type ResourceFiles = Record<string, Buffer>

export type ResourceProperties = {
    scope: Scope
    version: number
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    actor: string
    timestamp: string
    signature: string
    customAttributes: Record<string, any>
}

export type Resource<T extends ResourceFiles> = {
    scope: Scope
    version: number
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    files: [Extract<keyof T, string>]
    attributes: ResourceAttributes
}

export type CommonResourceAttributes = {
    lastModificationSignature: string
    lastModification: {
        actor: string
        timestamp: string
    }
}

export type ResourceAttributes = CommonResourceAttributes & {
    customAttributes: Record<string, any>
}
