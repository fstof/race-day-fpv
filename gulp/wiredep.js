'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	//gulp.src('app/styles/*.scss')
	//gulp.src('app/styles/*.less')
	//	.pipe(wiredep({
	//		directory: 'app/bower_components'
	//	}))
	//	.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest('app'));
});
