const fs = require('fs')
const path = require('path')

const ignition = require('@mussonindustrial/pyro-resource')
const _ = require('lodash')

const output = './output'

function logError(error) {
	if (error) {
		console.log(error)
	}
}

async function generateProjectImport(styleClasses) {
	const perspective = ignition.perspective
	const project = ignition.newProject(
		{ perspective },
		{ title: 'pyro-process' }
	)

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
		project.perspective.resources.styleClasses.node(styleClass, emptyStyle)
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
		require('@mussonindustrial/postcss-advanced-variables'),
		require('postcss-nested'),
		require('@mussonindustrial/postcss-perspective-style-class')({
			cb: generateProjectImport,
		}),
		require('autoprefixer'),
		require('cssnano'),
	],
}
