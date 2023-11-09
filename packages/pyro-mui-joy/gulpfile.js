var postcss = require('gulp-postcss')
var gulp = require('gulp')
var fs = require('fs')
var screenshots = require('./screenshots')

const output = './output'
const source = './src'

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    screenshots.cleanScreenshots()
    return gulp.src(source)
})

gulp.task('build', function () {
    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./output'))
})

gulp.task('generate-screenshots', async function () {
    await screenshots.build('joy-light')
    await screenshots.build('joy-dark')
    return gulp.src(source)
})

gulp.task('all', gulp.series('clean', 'build', 'generate-screenshots'))

exports.default = gulp
