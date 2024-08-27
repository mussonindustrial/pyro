var postcss = require('gulp-postcss')
var gulp = require('gulp')
var path = require('path')
var fs = require('fs')
var { createGateway } = require('./dev/setup')
const {
    createSymbolLibrary,
    uploadFonts,
    uploadIcons,
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
    // fs.cpSync(
    //     path.join('.', source, 'icons'),
    //     path.join('.', output, 'icons'),
    //     {
    //         recursive: true,
    //     }
    // )
    createSymbolLibrary('symbol')

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
    console.log(
        `Development gateway started: ${gateway.getPerspectiveUrl(
            false,
            'pyro-symbol-testing',
            'playground'
        )}`
    )

    return gulp.src(source)
})

gulp.task('dev:upload-themes', async function () {
    console.log('Uploading themes...')
    await Promise.all([uploadThemes(gateway)])

    console.log('Uploading themes complete.')
    return gulp.src(source)
})

gulp.task('dev:upload-fonts', async function () {
    console.log('Uploading fonts...')
    await Promise.all([uploadFonts(gateway)])

    console.log('Uploading fonts complete.')
    return gulp.src(source)
})

gulp.task('dev:upload-icons', async function () {
    console.log('Uploading icons...')
    await Promise.all([uploadIcons(gateway)])

    console.log('Uploading icons complete.')
    return gulp.src(source)
})

gulp.task('dev:upload-project', async function () {
    console.log('Uploading project import...')
    await Promise.all([uploadProjectImport(gateway)])

    console.log('Uploading project import complete.')
    return gulp.src(source)
})

gulp.task(
    'dev:upload-all',
    gulp.series(
        'dev:upload-fonts',
        'dev:upload-icons',
        'dev:upload-themes',
        'dev:upload-project'
    )
)

gulp.task('dev:refresh', async function () {
    console.log('Requesting project resource scan...')
    await requestScan(gateway)

    console.log('Refreshing Perspective Sessions...')
    await refreshSessions(gateway)

    return gulp.src(source)
})

gulp.task('dev:watch', function () {
    console.log('Watching for source file changes...')
    gulp.watch(
        './src/**/*.*',
        { events: 'all', delay: 1000 },
        gulp.series('clean', 'build', 'dev:upload-all', 'dev:refresh')
    )
})

gulp.task('all', gulp.series('clean', 'build'))
gulp.task(
    'dev',
    gulp.series('dev:start', 'dev:upload-all', 'dev:refresh', 'dev:watch')
)

exports.default = gulp
