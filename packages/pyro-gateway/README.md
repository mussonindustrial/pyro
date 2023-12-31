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

const gateway = await new IgnitionContainer('8.1.33')
    .withModules(['perspective'])
    .withGatewayName('My New Gateway')
    .start()
```

### Start a Gateway from a Backup

```js
import { IgnitionContainer } from '@mussonindustrial/pyro-gateway'

const gateway = await new IgnitionContainer('8.1.33')
    .withGatewayBackup('/path/to/gateway.gwbk')
    .start()
```

### Setting Gateway Properties

Gateway properties can be set before startup through the various `.with~` methods.

```js
// Current available setter methods
.withEdition(edition: GatewayEdition)
.withHTTPPort(port: number)
.withHTTPSPort(port: number)
.withModules(modules: ModuleIdentifier[])
.withGatewayName(name: string)
.withGatewayBackup(path: string)
```

The eventual goal is to provide a complete set of setter methods.
In the meantime, if you wish the directly set environment or runtime variables, they can be accessed through `gateway.env` and `gateway.runtime` respectively.

### Reaching your Gateway

By design, Testcontainers maps bound ports to random free ports on the host to avoid port collisions that may arise with locally running software or in between parallel test runs.

You can ask for the mapped port at runtime by using:

```js
const httpPort = gateway.getMappedHTTPPort()
const httpsPort = gateway.getMappedHTTPSPort()
```

Note you must get this mapped port even if you manually specify the gateway's HTTP or HTTPS ports.

## Changelog

The [changelog](https://github.com/mussonindustrial/pyro/releases) is regularly updated to reflect what's changed in each new release.

## Copyright and Licensing

Copyright (C) 2023 Musson Industrial

Free use of this software is granted under the terms of the MIT License.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-gateway.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-gateway
[pyro]: https://github.com/mussonindustrial/pyro
[pyro-gateway]: https://github.com/mussonindustrial/pyro/tree/main/packages/pyro-gateway
[Testcontainers]: https://node.testcontainers.org/
