module.exports = {
    plugins: [
        // require('postcss-simple-vars'),
        require('@csstools/postcss-design-tokens'),
        require('postcss-advanced-variables'),
        require('postcss-mixins'),
        require('postcss-nested'),
        require('postcss-import'),

        require('autoprefixer'),
    ],
}
