var fs = require('fs')
var path = require('path')
var { glob } = require('glob')
var axios = require('axios')
var { getWebdevClient } = require('./setup')
const { GATEWAY_PATH } = require('@mussonindustrial/pyro-gateway')

async function uploadResource(gateway, resource_type, path, file_buffer) {
	const client = await getWebdevClient(gateway)
	await client
		.post(`${resource_type}${path}`, file_buffer, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.catch(function (error) {
			console.log({ error })
		})
	return true
}

async function uploadThemes(gateway) {
	const files = await glob('output/themes/**/*.*')

	const filesToCopy = []
	for (const f of files) {
		filesToCopy.push({
			folder: GATEWAY_PATH.PERSPECTIVE_THEMES,
			source: f.replaceAll('\\', '/'),
		})
	}

	await gateway.copyFilesToGateway(filesToCopy)
	return true
}

async function uploadFonts(gateway) {
	await gateway.copyDirectoriesToGateway([
		{
			folder: GATEWAY_PATH.PERSPECTIVE_FONTS,
			source: 'output/fonts/Inter',
		},
	])
	return true
}

async function uploadProjectImport(gateway) {
	await gateway.importProjectResources(
		'pyro-process-testing2',
		'output/project-import.zip'
	)
	return true
}

function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	})
}

async function requestScan(gateway) {
	const client = await getWebdevClient(gateway)
	await client.get('/requestScan')
	return true
}

async function refreshSessions(gateway) {
	const client = await getWebdevClient(gateway)
	await client.get('/refreshSessions')
	return true
}

module.exports = {
	uploadResource,
	uploadProjectImport,
	uploadFonts,
	uploadThemes,
	requestScan,
	refreshSessions,
}
