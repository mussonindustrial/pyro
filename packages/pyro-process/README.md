# pyro-process [<img src="https://cdn.mussonindustrial.com/files/public/images/emblem.svg" alt="Musson Industrial Logo" width="90" height="40" align="right">][pyro]

[![NPM Version][npm-img]][npm-url]

[pyro-process] is a Perspective theme for developing P&ID displays.

> **Warning**<br>
> This repo is currently in active development, and breaking changes are to be expected.

## Building

```sh
git clone https://github.com/mussonindustrial/pyro
cd pyro
npm install
cd packages/pyro-process
npm run build
```

## Testing

This project provides a docker-based development server for rapid iteration.

> [!IMPORTANT]
> You must have a container environment (i.e. Docker) installed on your system to use the development server.
> After the docker container starts, this projects themes, fonts, and Perspective style classes are automatically loaded into the Ignition gateway.
> When changes are detected to the project's source files, the theme is rebuilt and re-uploaded to the development server.

```sh
git clone https://github.com/mussonindustrial/pyro
cd pyro
npm install
cd packages/pyro-process
npm run build
npm run dev
```

## Changelog

The [changelog](https://github.com/mussonindustrial/pyro/releases) is regularly updated to reflect what's changed in each new release.


## Copyright and Licensing

Copyright (C) 2024 Musson Industrial

Free use of this software is granted under the terms of the MIT License.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-process.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-process
[pyro]: https://github.com/mussonindustrial/pyro
[pyro-process]: https://github.com/mussonindustrial/pyro/tree/main/packages/pyro-process
