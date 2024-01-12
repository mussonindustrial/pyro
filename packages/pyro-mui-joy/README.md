# pyro-mui-joy [<img src="https://cdn.mussonindustrial.com/files/public/images/emblem.svg" alt="Musson Industrial Logo" width="90" height="40" align="right">][pyro]

[![NPM Version][npm-img]][npm-url]

[pyro-mui-joy] is a port of [mui-joy] for Ignition Perspective.

> **Warning**<br>
> This repo is currently in active development, and breaking changes are to be expected.

## About Joy UI

Joy UI is an open-source React component library that follows a lightly opinionated design direction, for a clean and modern UI that gives you plenty of room to customize the look and feel.

Maintained by MUI, Joy UI is an alternative to Material UI for projects that don't adhere to Material Design guidelines as a design system starting point.

Joy UI follows a lightly opinionated design direction called Joy Design. Simple and functional, it offers a thoughtfully crafted set of defaults to ensure that your next project looks and feels great before you even begin customizing.

## Installation

This project generates several files required for installation:

-   Light (joy-light), dark (joy-dark), and Auto (joy-auto) CSS theme files for _Perspective_
-   An _Ignition_ project import file containing a full set of _Perspective Style Classes_
-   A set of fonts

## Features

-   Light/Dark/Auto Modes
-   Color Inversion Support
-   Variant/Palette Support

## Building

```sh
git clone https://github.com/mussonindustrial/pyro
cd pyro
npm install
cd packages/pyro-mui-joy
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
cd packages/pyro-mui-joy
npm run build
npm run dev
```

## Changelog

The [changelog](https://github.com/mussonindustrial/pyro/releases) is regularly updated to reflect what's changed in each new release.

## Copyright and Licensing

Copyright (C) 2023 Musson Industrial

Free use of this software is granted under the terms of the MIT License.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-mui-joy.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-mui-joy
[pyro]: https://github.com/mussonindustrial/pyro
[mui-joy]: https://github.com/mui/material-ui/tree/master/packages/mui-joy
[pyro-mui-joy]: https://github.com/mussonindustrial/pyro/tree/main/packages/pyro-mui-joy
