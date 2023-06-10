var postcss = require('gulp-postcss');
var gulp = require('gulp');

gulp.task('default', function () {
    return gulp.src('./lib/*.css')
        .pipe(postcss())
        .pipe(gulp.dest('./build'));
});

exports.default = gulp