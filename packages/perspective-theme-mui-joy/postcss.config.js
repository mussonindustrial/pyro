const fs = require('fs')
const path = require('path')

const ignition = require('ignition-import')
const _ = require('lodash')

const output = './output'

function logError(error) {
    if (error) {
        console.log(error)
    }
}

async function generateProjectImport(styleClasses) {
    const perspective = ignition.perspective
    const project = ignition.newProject({ perspective })

    const emptyStyle = {
        base: {
            style: {},
        },
    }

    const save = (path) => {
        const [next, ...rest] = path.split('/')
        const remaining = rest.join('/')

        if (remaining !== '') {
            return ignition.newFolder(next, save(remaining))
        }
        return ignition.newNode(next, { style: emptyStyle })
    }

    let content = project.perspective.resources.styleClasses.content
    styleClasses.forEach((styleClass) => {
        content = _.merge(content, save(styleClass))
    })
    fs.writeFile(
        path.join(output, 'project-import.zip'),
        await project.zip(),
        logError
    )
}

module.exports = {
    plugins: [
        require('postcss-import'),
        require('@csstools/postcss-design-tokens'),
        require('postcss-advanced-variables'),
        require('postcss-nested'),
        require('postcss-perspective-style-class')({
            cb: generateProjectImport,
        }),
        require('autoprefixer'),
        require('cssnano'),
    ],
}
