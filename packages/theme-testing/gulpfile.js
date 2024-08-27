const gulp = require('gulp')
const fs = require('fs')
const { getTheme } = require('@mussonindustrial/pyro-mui-joy')

const output = './output'
const source = './src'

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    return gulp.src(source)
})

gulp.task('build', function (cb) {
    fs.writeFile(`${output}/auto.css`, getTheme('auto'), cb)
    fs.writeFile(`${output}/dark.css`, getTheme('dark'), cb)
    fs.writeFile(`${output}/light.css`, getTheme('light'), cb)
})

gulp.task('all', gulp.series('build'))

exports.default = gulp
