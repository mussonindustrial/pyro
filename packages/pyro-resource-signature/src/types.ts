export type Scope = 'N' | 'G' | 'D' | 'C' | 'A'

export const ScopePrimitives = {
    N: 0,
    G: 1,
    D: 2,
    C: 4,
    A: 7,
} as const

export type ResourceFiles<T extends string> = {
    [key in T]: string | Buffer | DataView
}

export type FlatResourceProps = {
    scope: Scope
    version: number
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    actor: string
    timestamp: string
    signature: string
    customAttributes: Record<string, unknown>
}

// UnionToIntersection<A | B> = A & B
type UnionToIntersection<U> = (
    U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
    ? I
    : never

// LastInUnion<A | B> = B
type LastInUnion<U> = UnionToIntersection<
    U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
    ? L
    : never

// UnionToTuple<A, B> = [A, B]
type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
    ? []
    : [Last, ...UnionToTuple<Exclude<T, Last>>]

export type ResourceDefinedProps<T extends string> = {
    scope: Scope
    version: number
    files: UnionToTuple<T>
    attributes: ResourceAttributes
}

export type InstanceDefinedProps = {
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
}

export type ResourceProps<T extends string> = ResourceDefinedProps<T> &
    InstanceDefinedProps

export type CommonResourceAttributes = {
    lastModificationSignature: string
    lastModification: {
        actor: string
        timestamp: string
    }
}

export type ResourceAttributes = CommonResourceAttributes & {
    customAttributes: Record<string, unknown>
}

export type Resource<T extends string> = {
    props: ResourceProps<T>
    files: ResourceFiles<T>
}

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export type PartialResourceProps<T extends string> = DeepPartial<
    ResourceProps<T>
>
