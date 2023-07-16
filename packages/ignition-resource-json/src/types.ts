export type Scope = 'N' | 'G' | 'D' | 'C' | 'A'

export const ScopePrimitives = {
    N: 0,
    G: 1,
    D: 2,
    C: 4,
    A: 7,
} as const

type UnionToTuple<T> = PickOne<T> extends infer U
    ? Exclude<T, U> extends never
        ? [T]
        : [...UnionToTuple<Exclude<T, U>>, U]
    : never

type Contra<T> = T extends any ? (arg: T) => void : never

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never

type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>

export type ResourceFiles<T extends string> = {
    [key in T]: Buffer
}

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

export type Resource<T> = {
    scope: Scope
    version: number
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    files: UnionToTuple<T>
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
