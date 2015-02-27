var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    order = require('gulp-order'),
    minifyCss = require('gulp-minify-css'),
    runSequence = require('run-sequence'),
    BUILD_DIRECTORY = 'build/tilesgame';

gulp.task('buildjs', function () {
    return gulp.src('source/**/*.js')
        .pipe(order([
            "js/add/tg-disclaimer.js",
            "js/tg-common.js",
            "js/tg-base.js",
            "js/*.js",
            "js/add/tg-plugin.js",
        ]))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('tilesgame.js'))
        .pipe(gulp.dest(BUILD_DIRECTORY))
        .pipe(concat('tilesgame.min.js'))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('buildcss', function () {
    return gulp.src('source/css/*.css')
        .pipe(concat('tilesgame.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('buildextras', function () {
    return gulp.src('source/extras/*')
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('buildreadme', function () {
    return gulp.src('readme.txt')
        .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('build', function () {
    var callback = function () {
        console.log(Date(), ': BUILD HAS BEEN COMPLETED');
    }
    console.log(Date(), ': BUILD HAS BEEN STARTED');
    runSequence(['buildjs', 'buildcss', 'buildextras', 'buildreadme'], callback);
})