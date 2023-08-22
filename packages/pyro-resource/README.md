# Pyro Import

The [Pyro Import] library lets you easily build Ignition-compatible project import files.

```js
import fs from 'fs'
import { newNode, newProject, perspective } from '@mussonindustrial/pyro-resource'

const project = newProject({ perspective })
project.perspective.resources.styleClasses.content = newNode('MyStyleClass', {
    style: { base: { style: {} } },
})

const zip = await project.zip()
fs.writeFileSync('./project-import.zip', zip)
```

## Usage

Add [Ignition Import] to your build tool:

```bash
npm install pyro-import --save-dev
```

Create a new project and include your desired modules:

```js
import {
    alarmNotification,
    newProject,
    perspective,
    reporting,
    sfc,
    sqlbridge,
    vision,
    webdev,
} from 'pyro-resource'

const project = newProject({
    alarmNotification,
    perspective,
    reporting,
    sfc,
    sqlbridge,
    vision,
    webdev,
})
```

Then add your resource content.

```js
const props = project.perspective.resource.generalProperties
props.
```

## Notes

### Type Hints

Each module comes with its own resource definitions and type hints for each required file.

```js
project.perspective.resources
// (property) resources: {
//     generalProperties: NodeResource<{
//         data: string;
//     }>;
//     pageConfig: NodeResource<{
//         config: string;
//     }>;
//     sessionProperties: NodeResource<{
//         props: string;
//     }>;
//     sessionScripts: NodeResource<...>;
//     styleClasses: FolderResource<...>;
//     views: FolderResource<...>;
// }
```

### Resource Contents

The content of a resource file can be specified

### Resource.json

The required `resource.json` files are automatically generated with correct resource signatures.
The signature logic is referenced from the [modification-updater] application.

## Advanced Usage

Custom module definitions can be created.

```js
import {
    newFolderResource,
    newModule,
    newNodeResource,
    newProject,
} from '@mussonindustrial/pyro-resource'

const myFolderResource = newFolderResource('my-resource', {
    file: 'file.json',
})

const mySingletonResource = newNodeResource('my-singleton-resource', {
    file: 'file.json',
    image: 'image.png',
    anotherFile: 'another.xml',
})

const myModule = newModule('com.acme.module', {
    myFolderResource,
    mySingletonResource,
})

const project = newProject({ myModule })

project.myModule.resources
// (property) resources: {
//     myFolderResource: FolderResource<{
//         file: string;
//     }>;
//     mySingletonResource: NodeResource<{
//         file: string;
//         image: string;
//         anotherFile: string;
//     }>;
// }
```

[Pyro Import]: https://github.com/mussonindustrial/pyro/packages/pyro-resource
[modification-updater]: https://github.com/paul-griffith/modification-updater
