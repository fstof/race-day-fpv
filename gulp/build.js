'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.sass())
		.pipe($.replace('../fonts/bootstrap', '../bower_components/bootstrap-sass/assets/fonts/bootstrap'))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size());
});

gulp.task('scripts', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.size());
});


gulp.task('html', ['styles', 'scripts'], function () {
	var jsFilter = $.filter('**/*.js');
	var cssFilter = $.filter('**/*.css');

	return gulp.src(['app/**/*.html'])
		.pipe($.useref.assets())
		.pipe($.rev())
		.pipe(jsFilter)
		.pipe($.ngAnnotate())
		.pipe($.uglify({preserveComments: $.uglifySaveLicense}))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe($.replace('bower_components/bootstrap-sass/assets/fonts/bootstrap', 'fonts'))
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe($.revReplace())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});

gulp.task('fonts', function () {
	return gulp.src('app/bower_components/**/*')
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size());
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], {read: false}).pipe($.rimraf());
});

gulp.task('build', ['html', 'images', 'fonts']);
