# postcss-perspective-style-class

[PostCSS] plugin for generating Perspective Style Classes using attribute syntax.

[PostCSS]: https://github.com/postcss/postcss

```css
[psc="Folder1/class"] { 
  color: black; 
}

[psc="Folder1/Folder2/class"] { 
  color: black; 
}

[psc="Folder1/class1"].otherClass1 .otherClass2 { 
  color: black; 
}



```

will be processed to:

```css
.psc-Folder1\/class { 
  color: black; 
}

.psc-Folder1\/Folder2\/class { 
  color: black; 
}

.psc-Folder1\/class1.otherClass1 .otherClass2 { 
  color: black; 
}
```

## Usage

**Step 1:** Install the plugin:

```sh
npm install --save-dev postcss postcss-perspective-style-class
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs] and set this plugin in settings.

**Step 3:** Add the plugin to the plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-perspective-style-class'),
    require('autoprefixer')
  ]
}
```

## Options

### `separator`

By default, the plugin will use `/` as the separator for Style Class folders.
Use this option to specify a custom separator to use in your CSS.

```js
postcss([ require('postcss-perspective-style-class')({ separator: '-' }) ])
```
```css
/* Input */
[psc="Folder1-class"] {
  color: black;
}

/* Output */
.psc-Folder1\/class { 
  color: black;
}
```

### `cb`

A callback function can be specified which will be supplied with a list of the Style Class paths encountered.

```js
const cb = (styleClasses) => console.log(styleClasses)
postcss([ require('postcss-perspective-style-class')({ cb }) ])
```
```css
[psc="Folder1/class1"].otherClass, 
[psc="Folder2/class2"] { 
  color: black; 
}
```
results in:
```js
[ 'Folder1/class1', 'Folder2/class2' ]
```

[official docs]: https://github.com/postcss/postcss#usage
