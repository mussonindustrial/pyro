var postcss = require('gulp-postcss')
var gulp = require('gulp')
var path = require('path')
var fs = require('fs')
var { createGateway } = require('./dev/setup')
const {
    uploadFonts,
    uploadThemes,
    uploadProjectImport,
    requestScan,
    refreshSessions,
} = require('./dev/upload')

const output = './output'
const source = './src'
let gateway

gulp.task('clean', function () {
    fs.rmSync(output, { recursive: true, force: true })
    return gulp.src(source)
})

gulp.task('build', function () {
    fs.cpSync(
        path.join('.', source, 'fonts'),
        path.join('.', output, 'fonts'),
        {
            recursive: true,
        }
    )

    return gulp
        .src('./src/*.css')
        .pipe(postcss())
        .pipe(gulp.dest(path.join(output, 'themes')))
})

// gulp.task('generate-screenshots', async function () {
//     await screenshots.build('joy-light')
//     await screenshots.build('joy-dark')
//     return gulp.src(source)
// })

gulp.task('dev:start', async function () {
    console.log('Creating development gateway...')
    gateway = await createGateway()
    console.log(`Development gateway started: ${gateway.getURI()}`)

    gulp.series('build', 'dev:upload')
    return gulp.src(source)
})

gulp.task('dev:upload', async function () {
    console.log('Uploading fonts and themes...')
    await Promise.all([uploadFonts(gateway), uploadThemes(gateway)])
    // console.log('Uploading fonts...')
    // await uploadFonts(gateway)

    // console.log('Uploading themes...')
    // await uploadThemes(gateway)

    // console.log('Uploading project import files...')
    // await uploadProjectImport(gateway)

    console.log('Requesting project resource scan...')
    await requestScan(gateway)

    console.log('Refreshing Perspective Sessions...')
    await refreshSessions(gateway)

    console.log('Upload complete.')
    return gulp.src(source)
})

gulp.task('dev:watch', function () {
    console.log('Watching for source file changes...')
    gulp.watch(
        './src/**/*.*',
        { events: 'all' },
        gulp.series('clean', 'build', 'dev:upload')
    )
})

gulp.task('all', gulp.series('clean', 'build'))
gulp.task('dev', gulp.series('dev:start', 'dev:upload', 'dev:watch'))

exports.default = gulp
