var postcss = require('gulp-postcss')
var gulp = require('gulp')

const output = './output'
const source = './src'

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    return gulp.src(source)
})

gulp.task('default', function () {
    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./output'))
})

exports.default = gulp
