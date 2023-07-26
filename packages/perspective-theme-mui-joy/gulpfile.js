var postcss = require('gulp-postcss')
var gulp = require('gulp')
const backstop = require('backstopjs')

const output = './output'
const source = './src'

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    return gulp.src(source)
})

gulp.task('default', function () {
    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./output'))
})

gulp.task('backstop_reference', () => backstop('reference'))
gulp.task('backstop_test', () => backstop('test'))

exports.default = gulp
