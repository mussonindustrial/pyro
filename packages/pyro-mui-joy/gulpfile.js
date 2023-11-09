var postcss = require('gulp-postcss')
var gulp = require('gulp')
var path = require('path')
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
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true })
    }

    fs.copyFile(
        path.join(source, 'fonts', 'Inter-VariableFont.ttf'),
        path.join(output, 'Inter-VariableFont.ttf'),
        (err) => {
            if (err) {
                console.log('Error copying fonts: ', err)
            }
        }
    )

    return gulp.src('./src/*.css').pipe(postcss()).pipe(gulp.dest('./output'))
})

gulp.task('generate-screenshots', async function () {
    await screenshots.build('joy-light')
    await screenshots.build('joy-dark')
    return gulp.src(source)
})

gulp.task('all', gulp.series('clean', 'build', 'generate-screenshots'))

exports.default = gulp
