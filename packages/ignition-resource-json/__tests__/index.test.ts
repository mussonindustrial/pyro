import { it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
    deserializeScope,
    serializeScope,
    toByte,
    toByteArray,
} from '../src/util'
import { hasValidSignature, newResource, parseResource } from '../src'

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
            actor: 'bmusson',
            timestamp: '2023-06-28T17:48:27Z',
        },
        {
            'style.json': fs.readFileSync(file),
        }
    )

    const referencePath = path.join(testsFolder, 'sample1', 'resource.json')
    const reference = await parseResource(fs.readFileSync(referencePath))

    expect(resource.attributes.lastModificationSignature).toBe(
        reference.attributes.lastModificationSignature
    )
})

it('should produce expected signature with Vision window example', async () => {
    const file = path.join(testsFolder, 'sample2', 'window.bin')
    const resource = await newResource(
        {
            scope: 'C',
            version: 2,
            restricted: false,
            overridable: true,
            actor: 'admin',
            timestamp: '2019-05-01T17:38:33Z',
            customAttributes: {
                'xml-format-version': 1,
            },
        },
        {
            'window.bin': fs.readFileSync(file),
        }
    )

    const referencePath = path.join(testsFolder, 'sample2', 'resource.json')
    const reference = await parseResource(fs.readFileSync(referencePath))

    expect(resource.attributes.lastModificationSignature).toBe(
        reference.attributes.lastModificationSignature
    )
})

it('should produce expected signature with Perspective view example', async () => {
    const view = path.join(testsFolder, 'sample3', 'view.json')
    const thumbnail = path.join(testsFolder, 'sample3', 'thumbnail.png')
    const resource = await newResource(
        {
            scope: 'G',
            version: 1,
            restricted: false,
            overridable: true,
            actor: 'admin',
            timestamp: '2020-05-06T18:22:14Z',
        },
        {
            'view.json': fs.readFileSync(view),
            'thumbnail.png': fs.readFileSync(thumbnail),
        }
    )

    const referencePath = path.join(testsFolder, 'sample3', 'resource.json')
    const reference = await parseResource(fs.readFileSync(referencePath))

    expect(resource.attributes.lastModificationSignature).toBe(
        reference.attributes.lastModificationSignature
    )
})

it('should verify correct signatures', async () => {
    const resource = await parseResource(
        fs.readFileSync(path.join(testsFolder, 'sample1', 'resource.json'))
    )

    let files = {}
    resource.files.forEach((file) => {
        files = {
            ...files,
            [file]: fs.readFileSync(path.join(testsFolder, 'sample1', file)),
        }
    })

    expect(await hasValidSignature(resource, files)).toEqual(true)
})

it('should verify incorrect signatures', async () => {
    const resource = await parseResource(
        fs.readFileSync(path.join(testsFolder, 'incorrect1', 'resource.json'))
    )

    let files = {}
    resource.files.forEach((file) => {
        files = {
            ...files,
            [file]: fs.readFileSync(path.join(testsFolder, 'incorrect1', file)),
        }
    })

    expect(await hasValidSignature(resource, files)).toEqual(false)
})
