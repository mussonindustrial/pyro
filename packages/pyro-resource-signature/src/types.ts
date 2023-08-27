export type Scope = 'N' | 'A' | Permutations<'G' | 'D' | 'C'>

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

type Permutations<T extends string, U extends string = T> =
    T extends any ? (T | `${T}${Permutations<Exclude<U, T>>}`) : never;

export type ResourceDefinedProps = {
    scope: Scope
    version: number
}

export type InstanceDefinedProps<TAttributes={}> = {
    documentation?: string
    locked?: boolean
    restricted: boolean
    overridable: boolean
    attributes: DefaultAttributes & TAttributes
}

export type UserProvidedProps<TFiles extends string, TAttributes={}> = ResourceDefinedProps & 
InstanceDefinedProps<TAttributes> & { 
    files: UnionToTuple<TFiles>
}

export type DefaultAttributes = {
    lastModification?: {
        actor?: string
        timestamp?: string
    }
}

export type SignedResource = {
    attributes: {
        lastModificationSignature: string
    }
}

export type CompleteResourceProps<TFiles extends string, TAttributes={}>  = UserProvidedProps<TFiles, TAttributes> & SignedResource

export type Resource<TFiles extends string, TAttributes={}> = {
    props: CompleteResourceProps<TFiles, TAttributes>
    files: ResourceFiles<TFiles>
}

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export type PartialResourceProps<TFiles extends string, TAttributes={}> = DeepPartial<
    UserProvidedProps<TFiles, TAttributes>
>
