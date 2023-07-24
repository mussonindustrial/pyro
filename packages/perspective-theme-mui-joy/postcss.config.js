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
        'style.json': JSON.stringify(
            {
                base: {
                    style: {},
                },
            },
            null,
            4
        ),
    }

    styleClasses.forEach((styleClass) => {
        const path = styleClass.split('/')
        project.perspective.resources.styleClasses.node(path, emptyStyle)
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
