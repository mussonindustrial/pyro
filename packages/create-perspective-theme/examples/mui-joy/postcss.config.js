module.exports = {
    plugins: [
        require('postcss-import'),
        require('@csstools/postcss-design-tokens'),
        require('postcss-advanced-variables'),
        // require('postcss-mixins'),
        require('postcss-nested'),
        require('autoprefixer'),
        require('postcss-perspective-style-class'),
    ],
}
