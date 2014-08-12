'use strict';
// generated on 2014-08-12 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('public/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('public/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('public/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('watch', ['styles','react'], function () {
    // watch for changes
    gulp.watch('public/react/**/*.jsx', ['react']);
    gulp.watch('public/styles/**/*.scss', ['styles']);
    gulp.watch('public/scripts/**/*.js', ['scripts']);
});

// End Boilerplate

gulp.task('react', function () {
    gulp.src('public/react/**/*.jsx')
        .pipe($.plumber())
        .pipe($.react())
        .pipe(gulp.dest('public/react'));
});
