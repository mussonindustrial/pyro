# Ignition Resource JSON Library

The [Ignition Resource JSON] library lets you easily generate Ignition project `resource.json` files with accurate signatures. 

Credit to @paul-griffith and their [modification-updater] application for the key signature logic.

## Installation

Using npm:
```sh
npm install --save ignition-resource-json
```
## API

### Build a new `resource.json` file
```js
import { newResource } from 'ignition-resource-json'

const resource = await newResource(
    {
        scope: 'gateway',
        version: 1,
        restricted: false,
        overridable: true,
        actor: 'bmusson',
        timestamp: '2023-06-28T17:48:27Z',
    },
    {
        'style.json': fs.readFileSync('style/style.json'),
    }
)
console.log(resource)
// {
//   scope: 'G',
//   version: 1,
//   restricted: false,
//   overridable: true,
//   files: [ 'style.json' ],
//   attributes: {
//     lastModification: { actor: 'bmusson', timestamp: '2023-06-28T17:48:27Z' },
//     lastModificationSignature: '469a4d209743a8ac22aa87d150af6ef7b95b2818fee0ef805d13f70c6952b14c'
//   }
// }
```

### Parse an existing `resource.json` file
```js
import { parseResource } from 'ignition-resource-json'

const resource = await parseResource(fs.readFileSync('view/resource.json'))
console.log(resource)
// {
//   scope: 'G',
//   version: 1,
//   restricted: false,
//   overridable: true,
//   files: [ 'thumbnail.png', 'view.json' ],
//   attributes: {
//     lastModificationSignature: 'e86aeeb367e98741786baf6a8632ce29301ab5827ebb2d7d6e07c3664ab07ae5',
//     lastModification: { actor: 'admin', timestamp: '2020-05-06T18:22:14Z' }
//   }
// }
```

### Verify an existing `resource.json` file signature
```js
import { parseResource, hasValidSignature } from 'ignition-resource-json'

const resource = await parseResource(fs.readFileSync('view/resource.json'))
console.log(await hasValidSignature(resource))
// true
```



[Ignition Resource JSON]: https://github.com/mussonindustrial/ignition-tools/packages/ignition-resource-json
[modification-updater]: https://github.com/paul-griffith/modification-updater