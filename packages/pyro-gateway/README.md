# pyro-gateway [<img src="https://cdn.mussonindustrial.com/files/public/images/emblem.svg" alt="Musson Industrial Logo" width="90" height="40" align="right">][pyro]

[![NPM Version][npm-img]][npm-url]

[pyro-gateway] provides an API for starting Ignition Docker Containers from within Javascript.
This library is intended for use in testing environments where you need a short-lived, programmatically configured, ephemeral gateway.

[pyro-gateway] is powered by [Testcontainers].

## About Testcontainers

Testcontainers is a testing library that provides easy and lightweight APIs for bootstrapping integration tests with real services wrapped in Docker containers. Using Testcontainers, you can write tests that talk to the same type of services you use in production, without mocks or in-memory services.

## Installation

Using npm:

```sh
npm install @mussonindustrial/pyro-gateway
```

## Usage

### Start a new Gateway

```js
import { IgnitionContainer } from '@mussonindustrial/pyro-gateway'

const gateway = await new IgnitionContainer(
    'inductiveautomation/ignition:latest'
)
    .withModules(['perspective'])
    .withGatewayName('My New Gateway')
    .start()
```

### Start a Gateway from a Backup

```js
import { IgnitionContainer } from '@mussonindustrial/pyro-gateway'

const gateway = await new IgnitionContainer(
    'inductiveautomation/ignition:8.1.33'
)
    .withGatewayBackup('/path/to/gateway.gwbk')
    .start()
```

### Import resources into a project

```js
import { IgnitionContainer } from '@mussonindustrial/pyro-gateway'

const gateway = await new IgnitionContainer(
    'inductiveautomation/ignition:latest'
)
    .withGatewayBackup('/path/to/gateway.gwbk')
    .start()

await gateway.importProjectResources(
    'project-to-import-into',
    'path/to/project-export.zip'
)
```

### Setting Gateway Properties

Gateway properties can be set before startup through the various `.with~` methods.

```js
.withActivationToken(token: string)
.withAdminUsername(username: string)
.withAdminPassword(password: string)
.withDebugMode(debugMode: boolean)
.withEdition(edition: GatewayEdition)
.withGanPort(port: number)
.withGatewayBackup(path: string)
.withGatewayName(name: string)
.withGid(gid: number)
.withHttpPort(port: number)
.withHttpsPort(port: number)
.withInstallPath(installPath: string)
.withLicenseKey(key: string)
.withModules(modules: ModuleIdentifier[])
.withMaxMemory(memoryMax: number)
.withQuickStart(quickStart: boolean)
.withTimezone(timezone: string)
.withUid(uid: number)
```

Complete details on the available properties and their functions are available at [Ignition Docker Image Documentation]

### Reaching your Gateway

By design, Testcontainers maps bound ports to random free ports on the host to avoid port collisions that may arise with locally running software or in between parallel test runs.

You can ask for the mapped port at runtime by using:

```js
const httpPort = gateway.getHttpPort()
const httpsPort = gateway.getHttpsPort()
const ganPort = gateway.getGanPort()
```

These are the ports you will use to access the gateway from outside of the container.

### Interacting with a Running Gateway

#### Gateway URLs

Several convenience methods exist for retrieving gateway URLs.
These methods will return using the mapped Testcontainers ports for HTTP and HTTPS.

```js
gateway.getUrl(https = false)
gateway.getImagesUrl(https = false)
gateway.getInfoUrl(https = false)
gateway.getPerspectiveUrl(https = false, project: string, ...paths: string[])
gateway.getStatusUrl(https = false)
gateway.getWebdevUrl(https = false, project: string, ...paths: string[])
```

#### Importing Resources

Resources can be imported into the gateway either through copying files/directories or through project/project resource imports.

##### File / Directory Copying

Extensions of Testcontainer's file/directory copy methods are provided to make it simpler to put files where you need them in Ignition's install directory.

```js
// Provided destination folders are relative to Ignition's install directory.
gateway.copyDirectoriesToGateway([
    {
        folder: '/user-lib/pylib', // relative to install
        source: '/path/to/libraryA', // source path
    },
    {
        folder: '/user-lib/pylib', // relative to install
        source: '/path/to/libraryB', // source path
    },
])

gateway.copyFilesToGateway([
    {
        folder: GATEWAY_PATH.PERSPECTIVE_THEMES, // provided in library
        source: '/path/to/my-theme.css', // source path
    },
])
```

#### Project and Resource Import

Full project backups and partial resource export can be imported into the running gateway.

```js
// Create a new project from an export.
gateway.importProject('new-project', '/path/to/project.zip')

// Import resources into an existing project.
gateway.importProjectResources('existing-project', '/path/to/resources.zip')
```

> [!IMPORTANT]
> The implementation is pretty naïve at the moment; if you import resources into a project that doesn't exist you'll end up with orphaned files.
> More work is coming to make it impossible to mess up, but at least it does work.

## Changelog

The [changelog](https://github.com/mussonindustrial/pyro/blob/main/packages/pyro-gateway/CHANGELOG.md) is regularly updated to reflect what's changed in each new release.

## Copyright and Licensing

Copyright (C) 2023 Musson Industrial

Free use of this software is granted under the terms of the MIT License.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-gateway.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-gateway
[pyro]: https://github.com/mussonindustrial/pyro
[pyro-gateway]: https://github.com/mussonindustrial/pyro/tree/main/packages/pyro-gateway
[Testcontainers]: https://node.testcontainers.org/
[Ignition Docker Image Documentation]: https://docs.inductiveautomation.com/display/DOC81/Docker+Image
