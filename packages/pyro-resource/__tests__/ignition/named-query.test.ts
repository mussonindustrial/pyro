import { it, expect } from 'vitest'
import fs from 'fs'
import { newProject, ignition } from '../../src'

function getProject() {
    return newProject({ ignition })
}

function getRoot() {
    return getProject().ignition.resources.namedQuery
}

it('should contain root', async () => {
    expect(getRoot()).toBeDefined()
})


it('should perform a zip', async () => {
    const p = getProject()
    p.ignition.resources.namedQuery.node('test', {
        'query.sql': 'content'
    }, {
        documentation: 'Text goes here.',
        attributes: {
            database: 'Test',
            maxReturnSize: 500
        }
    })
    
    const zip = await p.zip()
    fs.writeFileSync('./.temp/named-query.zip', zip)
})
