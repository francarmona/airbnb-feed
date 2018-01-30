var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var assign = require('lodash/assign');
var runSequence = require('run-sequence');
var del = require('del');
var nodemon = require('gulp-nodemon');
var paths = {
    pages: ['src/public/*.html']
};

var isWatchify = false;
var bundles = [
    {
        entries: ['./src/public/main.ts'],
        output: 'main.js',
        extensions: ['main.ts'],
        destination: './dist/public/js'
    }, {
        entries: ['./src/server/index.ts'],
        output: 'index.js',
        extensions: ['.ts'],
        destination: './dist/server'
    }
];

function bundle(brw, options) {
    return brw
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source(options.output))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(options.destination));
}

var createBundle = function (options) {
    var opts = assign({}, watchify.args, {
        entries: options.entries,
        extensions: options.extensions,
        debug: true
    });

    var brw = browserify(opts);

    if (isWatchify) {
        brw = watchify(brw);
        brw.on('update', function () {
            bundle(brw, options)
        });
    }
    return bundle(brw, options);
}

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist/public"));
});

gulp.task('bundle', function () {
    bundles.forEach(function (bundle) {
        createBundle({
            entries: bundle.entries,
            output: bundle.output,
            extensions: bundle.extensions,
            destination: bundle.destination
        });
    });
});

gulp.task('start', function () {
    nodemon({
        script: 'dist/server/index.js'
    })
})

gulp.task('serve', function () {
    isWatchify = true;
    runSequence('clean', 'copy-html', 'bundle');
});