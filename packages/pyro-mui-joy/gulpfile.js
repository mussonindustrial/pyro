var postcss = require('gulp-postcss')
var gulp = require('gulp')
var fs = require('fs')
var tests = require('./tests')

const output = './output'
const source = './src'

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    tests.cleanScreenshots()
    return gulp.src(source)
})

gulp.task('build', function () {
    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./output'))
})

gulp.task('generate-screenshots', async function () {
    await tests.generateScreenshots('joy-light')
    await tests.generateScreenshots('joy-dark')
    return gulp.src(source)
})

gulp.task('all', gulp.series('clean', 'build', 'generate-screenshots'))

exports.default = gulp
