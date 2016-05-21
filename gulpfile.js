'use strict';

var gulp = require('gulp');
var env = require('gulp-env');

env({
    file: '.env.json'
});

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
