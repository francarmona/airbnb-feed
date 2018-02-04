var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require('tsify');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var assign = require('lodash/assign');
var runSequence = require('run-sequence');
var del = require('del');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var paths = {
    pages: ['src/public/*.html']
};

var isWatchify = false;
var bundles = [
    {
        entries: ['./src/public/main.ts'],
        output: 'main.js',
        extensions: ['.ts'],
        destination: './dist/public/js'
    },
    {
        entries: ['./src/public/sw/index.ts'],
        output: 'sw.js',
        extensions: ['.ts'],
        destination: './dist/public'
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

gulp.task("copy:html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist/public"));
});

gulp.task('bundle:app', function () {
    bundles.forEach(function (bundle) {
        createBundle({
            entries: bundle.entries,
            output: bundle.output,
            extensions: bundle.extensions,
            destination: bundle.destination
        });
    });
});

gulp.task('sass', function () {
    return gulp.src('./src/public/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/public/css'));
});

gulp.task("copy:manifest", function () {
    return gulp.src('./src/public/manifest.json')
        .pipe(gulp.dest("dist/public"));
});

gulp.task("copy:fonts", function () {
    return gulp.src('./src/public/fonts/**')
        .pipe(gulp.dest("dist/public/fonts"));
});

gulp.task("copy:images", function () {
    return gulp.src('./src/public/imgs/**')
        .pipe(gulp.dest("dist/public/imgs"));
});

gulp.task("copy:js", function () {
    return gulp.src('./src/public/js/*.js')
        .pipe(gulp.dest("dist/public/js"));
});

gulp.task("copy:json", function () {
    return gulp.src('./src/server/json/*.json')
        .pipe(gulp.dest("dist/server"));
});

gulp.task('start:server', function () {
    nodemon({
        script: 'dist/server/index.js'
    })
    .on('restart', function () {
        console.log('restarted!')
    });
});

gulp.task('build:server', function (){
    return gulp.src('src/server/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('dist/server'));
});

gulp.task('watch', function() {
    gulp.watch('src/server/*.ts', ['build:server']);
    gulp.watch('src/public/*.html', ['copy:html']);
    gulp.watch('src/public/scss/**/*.scss', ['sass']);
});

gulp.task('copy:all', function(){
    runSequence('copy:html', 'copy:manifest', 'copy:fonts', 'copy:images', 'copy:js', 'copy:json');
});

gulp.task('build', function () {
    runSequence('clean', ['copy:all', 'bundle:app', 'sass', 'build:server']);
});

gulp.task('serve', function () {
    isWatchify = true;
    runSequence('clean', ['copy:all', 'bundle:app', 'sass', 'build:server'], ['start:server', 'watch']);
});