import { it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
    deserializeScope,
    serializeScope,
    toByte,
    toByteArray,
} from '../src/util'
import { Resource, hasValidSignature, newResource, parseResource } from '../src'

function signatureMatch<TFiles extends string, TAttributes={}>(
    resource1: Resource<TFiles, TAttributes>,
    resource2: Resource<TFiles, TAttributes>
) {
    return resource1.props.attributes.lastModificationSignature == resource2.props.attributes.lastModificationSignature
}

async function validSignature<TFiles extends string, TAttributes={}>(resource: Resource<TFiles, TAttributes>) {
    return (await hasValidSignature(resource))
}

async function invalidSignature<TFiles extends string, TAttributes={}>(resource: Resource<TFiles, TAttributes>) {
    return !(await hasValidSignature(resource))
}

const testsFolder = path.join('.', '__tests__')

it('should serialize none scope', async () => {
    expect(serializeScope('N')).toMatchInlineSnapshot('0')
})

it('should serialize gateway scope', async () => {
    expect(serializeScope('G')).toMatchInlineSnapshot('1')
})

it('should serialize designer scope', async () => {
    expect(serializeScope('D')).toMatchInlineSnapshot('2')
})

it('should serialize common scope', async () => {
    expect(serializeScope('C')).toMatchInlineSnapshot('4')
})

it('should serialize all scope', async () => {
    expect(serializeScope('A')).toMatchInlineSnapshot('7')
})

it('should serialize combined scope', async () => {
    expect(serializeScope('CD')).toMatchInlineSnapshot('6')
})

it('should deserialize none scope', async () => {
    expect(deserializeScope(0)).toMatchInlineSnapshot('"N"')
})

it('should deserialize gateway scope', async () => {
    expect(deserializeScope(1)).toMatchInlineSnapshot('"G"')
})

it('should deserialize designer scope', async () => {
    expect(deserializeScope(2)).toMatchInlineSnapshot('"D"')
})

it('should deserialize common scope', async () => {
    expect(deserializeScope(4)).toMatchInlineSnapshot('"C"')
})

it('should deserialize all scope', async () => {
    expect(deserializeScope(7)).toMatchInlineSnapshot('"A"')
})

it('should deserialize complex scope', async () => {
    expect(deserializeScope(5)).toMatchInlineSnapshot('"GC"')
})

it('should convert numbers to byte array buffer', async () => {
    expect(toByteArray(1553123)).toMatchInlineSnapshot(`
      {
        "data": [
          0,
          23,
          178,
          227,
        ],
        "type": "Buffer",
      }
    `)
})

it('should convert boolean to byte buffer', async () => {
    expect(toByte(true)).toMatchInlineSnapshot(`
      {
        "data": [
          1,
        ],
        "type": "Buffer",
      }
    `)
})

it('should produce expected signature with style class example', async () => {
    const file = path.join(testsFolder, 'sample1', 'style.json')
    const resource = await newResource(
        {
            scope: 'G',
            version: 1,
            restricted: false,
            overridable: true,
            attributes: {
                lastModification: {
                    actor: 'admin',
                    timestamp: '2020-05-06T18:13:04Z',
                },
            },
        },
        {
            'style.json': fs.readFileSync(file),
        }
    )

    const reference = await parseResource(path.join(testsFolder, 'sample1'))

    expect(signatureMatch(resource, reference)).toBe(true)
})

it('should produce expected signature with Vision window example', async () => {
    const file = path.join(testsFolder, 'sample2', 'window.bin')
    const resource = await newResource(
        {
            scope: 'C',
            version: 2,
            restricted: false,
            overridable: true,
            attributes: {
                lastModification: {
                    actor: 'admin',
                    timestamp: '2019-05-01T17:38:33Z',
                },
                'xml-format-version': 1,
            },
        },
        {
            'window.bin': fs.readFileSync(file),
        }
    )

    const reference = await parseResource(path.join(testsFolder, 'sample2'))

    expect(signatureMatch(resource, reference)).toBe(true)
})

it('should produce expected signature with Perspective view example', async () => {
    const view = path.join(testsFolder, 'sample3', 'view.json')
    const thumbnail = path.join(testsFolder, 'sample3', 'thumbnail.png')
    const resource = await newResource(
        {
            scope: 'G',
            version: 1,
            restricted: false,
            overridable: false,
            attributes: {
                lastModification: {
                    actor: 'admin',
                    timestamp: '2022-01-05T18:19:55Z',
                },
            },
        },
        {
            'thumbnail.png': fs.readFileSync(thumbnail),
            'view.json': fs.readFileSync(view),
        }
    )

    const reference = await parseResource(path.join(testsFolder, 'sample3'))

    expect(signatureMatch(resource, reference)).toBe(true)
})

it('should produce expected signature with Perspective general properties example', async () => {
    const data = path.join(testsFolder, 'sample4', 'data.bin')
    const resource = await newResource(
        {
            scope: 'G',
            version: 1,
            restricted: false,
            overridable: true,
            attributes: {
                lastModification: {
                    actor: 'admin',
                    timestamp: '2021-12-23T19:55:44Z',
                },
            },
        },
        {
            'data.bin': fs.readFileSync(data),
        }
    )

    const reference = await parseResource(path.join(testsFolder, 'sample4'))

    expect(signatureMatch(resource, reference)).toBe(true)
})

it('should verify correct signatures', async () => {
    const reference = await parseResource(path.join(testsFolder, 'sample1'))

    expect(await validSignature(reference)).toBe(true)
})

it('should verify incorrect signatures', async () => {
    const reference = await parseResource(path.join(testsFolder, 'incorrect1'))

    expect(await invalidSignature(reference)).toBe(true)
})
