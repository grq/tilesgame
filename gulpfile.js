var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    order = require('gulp-order'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    buldDir = 'build/tilesgame',
    buldDirExtras = buldDirExtras + '/extras';

gulp.task('cleanBuildFolder', function () {
    return gulp.src(buldDir).pipe(clean());
});

gulp.task('buildjs', ['cleanBuildFolder'], function () {
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
        .pipe(gulp.dest(buldDir))
        .pipe(rename('tilesgame.min.js'))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(buldDir));
});

gulp.task('buildcss', ['cleanBuildFolder'], function () {
    return gulp.src('source/styles/*.css')
        .pipe(concat('tilesgame.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(buldDir));
});

gulp.task('copyextras', ['cleanBuildFolder'], function () {
    return gulp.src('source/styles/extras/*').pipe(gulp.dest(buldDirExtras));
});

gulp.task('copyreadme', ['cleanBuildFolder'], function () {
    return gulp.src('readme.txt').pipe(gulp.dest(buldDir));
});

gulp.task('build', ['buildjs', 'buildcss', 'copyextras', 'copyreadme']);