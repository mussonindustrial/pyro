# pyro-resource-signature [<img src="https://cdn.mussonindustrial.com/files/public/images/emblem.svg" alt="Musson Industrial Logo" width="90" height="40" align="right">][pyro]

[![NPM Version][npm-img]][npm-url]

[pyro-resource-signature] lets you generate Ignition project `resource.json` files with accurate signatures.

## Installation

Using npm:

```sh
npm install --save @mussonindustrial/pyro-resource-signature
```

## API

### Build a new `resource.json` file

```js
import fs from 'fs'
import { newResource } from '@mussonindustrial/pyro-resource-signature'

const resource = await newResource(
    {
        scope: 'G',
        version: 1,
        restricted: false,
        overridable: true,
        attributes: {
            lastModification: {
                actor: 'bmusson',
                timestamp: '2023-06-28T17:48:27Z',
            },
        },
    },
    {
        'style.json': fs.readFileSync('./style/style.json'),
    }
)
console.log(JSON.stringify(resource, null, 2))
// {
//   "props": {
//     "scope": "G",
//     "version": 1,
//     "restricted": false,
//     "overridable": true,
//     "files": [
//       "style.json"
//     ],
//     "attributes": {
//       "lastModification": {
//         "actor": "bmusson",
//         "timestamp": "2023-06-28T17:48:27Z"
//       },
//       "lastModificationSignature": "469a4d209743a8ac22aa87d150af6ef7b95b2818fee0ef805d13f70c6952b14c"
//     }
//   },
//   "files": {
//     "style.json": {
//       "type": "Buffer",
//       "data": [...]
//     }
//   }
// }
```

### Parse an existing `resource.json` file

```js
import fs from 'fs'
import { parseResource } from '@mussonindustrial/pyro-resource-signature'

const MyView = (await parseResource('./views/MyView')))
console.log(JSON.stringify(MyView.props, null, 2))
// {
//   "scope": "G",
//   "version": 1,
//   "restricted": false,
//   "overridable": false,
//   "files": [
//     "thumbnail.png",
//     "view.json"
//   ],
//   "attributes": {
//     "lastModification": {
//       "actor": "admin",
//       "timestamp": "2022-01-05T18:19:55Z"
//     },
//     "lastModificationSignature": "3997d8f779b3c73dff658cb92ceb9b6de64a66aad2b4e04df9f45a46824f3a3f"
//   }
// }

const view = JSON.parse(MyView.files['view.json'].toString())
```

### Verify an existing `resource.json` file signature

```js
import fs from 'fs'
import { parseResource, hasValidSignature } from '@mussonindustrial/pyro-resource-signature'

const MyView = await parseResource('./views/MyView'))

console.log(await hasValidSignature(MyView))
// true
```

### Updating an existing `resource.json` file signature

```js
import fs from 'fs'
import { parseResource, updateSignature } from '@mussonindustrial/pyro-resource-signature'

const MyView = await parseResource('./views/MyView'))

console.log(await updateSignature(MyView))
// true (if updated)
```

## Acknowledgements

-   @paul-griffith's [modification-updater] application for the key signature logic.

[npm-img]: https://img.shields.io/npm/v/@mussonindustrial/pyro-resource-signature.svg
[npm-url]: https://www.npmjs.com/package/@mussonindustrial/pyro-resource-signature
[pyro]: https://github.com/mussonindustrial/pyro
[pyro-resource-signature]: https://github.com/mussonindustrial/pyro/packages/pyro-resource-signature
[modification-updater]: https://github.com/paul-griffith/modification-updater
