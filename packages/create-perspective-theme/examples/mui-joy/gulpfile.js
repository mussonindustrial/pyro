var postcss = require('gulp-postcss')
var gulp = require('gulp')

gulp.task('default', function () {
    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./build'))
})

exports.default = gulp
