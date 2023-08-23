# pyro-resource [<img src="https://cdn.mussonindustrial.com/files/public/images/emblem.svg" alt="Musson Industrial Logo" width="90" height="40" align="right">][pyro]

[![NPM Version][npm-img]][npm-url]

[pyro-resource] lets you build Ignition-compatible project resource files in JavaScript.

```js
import fs from 'fs'
import { newProject, perspective } from '@mussonindustrial/pyro-resource'

const project = newProject({ perspective })

const styleClasses = project.perspective.resources.styleClasses
styleClasses.node('MyStyleClass', {
    'style.json': '{ base: { style: {} } }',
})

const zip = await project.zip()
fs.writeFileSync('./project-import.zip', zip)
```

## Usage

1. Add [pyro-resource] to your build tool:

```bash
npm install @mussonindustrial/pyro-resource
```

2. Create a new project and include your desired modules.

```js
import {
    alarmNotification,
    newProject,
    perspective,
    reporting,
    sfc,
    sqlBridge,
    vision,
    webdev,
} from '@mussonindustrial/pyro-resource'

const project = newProject({
    alarmNotification,
    perspective,
    reporting,
    sfc,
    sqlBridge,
    vision,
    webdev,
})
```

3. Add your resource content.

```js
const pageConfig = project.perspective.resources.pageConfig
// Setting node content.
pageConfig.set({
    'config.json': '{}',
})

const styleClasses = project.perspective.resources.styleClasses
// Creating a node.
styleClasses.node('MyStyleClass', {
    'style.json': '{ base: { style: {} } }',
})

// Creating a node in a folder.
styleClasses.node('Folder/StyleClass', {
    'style.json': '{ base: { style: {} } }',
})

// Creating a folder.
const folder = styleClasses.folder('Folder2')
folder.node('InAFolder', {
    'style.json': '{ base: { style: {} } }',
})
```

4. Zip the project and write to disk.

```js
const zip = await project.zip()
fs.writeFileSync('./projectImport.zip', zip)
```

## `resource.json` Files

The required `resource.json` files are generated and signed using [pyro-resource-signature].

## Type Hints

Each module comes with resource definitions and type hints for the required files.

```js
project.perspective.resources
// (property) resources: {
//     generalProperties: NodeResource<readonly ["data.bin"]>;
//     pageConfig: NodeResource<readonly ["config.json"]>;
//     sessionProperties: NodeResource<readonly ["props.json"]>;
//     sessionScripts: NodeResource<...>;
//     styleClasses: FolderResource<...>;
//     views: FolderResource<...>;
// }
```

## Custom Modules and Resources

Custom module definitions can be created in order to support 3rd party modules (with complete type hinting).

```js
import {
    newFolderResource,
    newModule,
    newNodeResource,
    newProject,
} from '@mussonindustrial/pyro-resource'

const myFolderResource = newFolderResource('my-resource', ['file.json'])

const mySingletonResource = newNodeResource('my-singleton-resource', [
    'file.json',
    'image.png',
    'another.xml',
])

const myModule = newModule('com.acme.module', {
    myFolderResource,
    mySingletonResource,
})

const project = newProject({ myModule })

project.myModule.resources
// (property) resources: {
//     myFolderResource: FolderResource<readonly ["file.json"]>;
//     mySingletonResource: NodeResource<readonly ["file.json", "image.png", "another.xml"]>;
// }
```

## Copyright and Licensing

Copyright (C) 2023 Musson Industrial

Free use of this software is granted under the terms of the MIT License.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-resource.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-resource
[pyro]: https://github.com/mussonindustrial/pyro
[pyro-resource]: https://github.com/mussonindustrial/pyro/packages/pyro-resource
[pyro-resource-signature]: https://github.com/mussonindustrial/pyro/packages/pyro-resource-signature
