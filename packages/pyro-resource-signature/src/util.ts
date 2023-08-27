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
    let s = 0
    for (const c of scope) {
        s += ScopePrimitives[c as keyof typeof ScopePrimitives]
    }
    return s
}

export function deserializeScope(value: number): Scope {
    const bits = value.toString(2).padStart(3, '0')
    let i = 0
    let scope = ''
    for (const b of bits.split('').reverse().join('')) {
        if (Number(b) !== 0) {
            scope += (
                Object.keys(ScopePrimitives) as (keyof typeof ScopePrimitives)[]
            ).find((key) => ScopePrimitives[key] === 1 << i)
        }
        i++
    }

    if (scope === '') {
        return 'N'
    }

    const allScopes = ['G', 'C', 'D']
    if (allScopes.every((char) => scope.split('').includes(char))) {
        scope = 'A'
    }

    return scope as Scope
}
