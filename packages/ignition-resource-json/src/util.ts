import { Scope, ScopePrimitives } from './types'

export function toByteArray(value: number) {
    return Buffer.from([
        (value >> 24) & 0xff,
        (value >> 16) & 0xff,
        (value >> 8) & 0xff,
        value & 0xff,
    ])
}

export function toByte(value: boolean) {
    return Buffer.from([value ? 1 : 0])
}

export function serializeScope(scope: Scope): number {
    return ScopePrimitives[scope]
}

export function deserializeScope(value: number): Scope {
    const scope = (
        Object.keys(ScopePrimitives) as (keyof typeof ScopePrimitives)[]
    ).find((key) => ScopePrimitives[key] === value)

    if (scope === undefined) {
        throw new RangeError(`Scope value ${value} could not be deserialized.`)
    }
    return scope
}
