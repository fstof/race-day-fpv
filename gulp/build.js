'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		//.pipe($.plumber())
		.pipe($.sass())
		//.pipe($.replace('../fonts/bootstrap', '../bower_components/bootstrap-sass/assets/fonts/bootstrap'))
		//.pipe($.replace('../fonts', '../bower_components/components-font-awesome/fonts'))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size());
});

gulp.task('scripts', function () {
	return gulp.src(['app/scripts/**/*.js', '!app/scripts/**/faker.js'])
		//.pipe($.ngAnnotate({
		//	remove: true,
		//	add: true,
		//	single_quotes: true
		//}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		//.pipe(gulp.dest('app/scripts'))
		.pipe($.size());
});


gulp.task('html', ['styles', 'scripts'], function () {
	var jsFilter = $.filter(['**/*.js'], {restore: true});
	var cssFilter = $.filter(['**/*.css'], {restore: true});
	var assets = $.useref.assets();

	return gulp.src(['app/**/*.html'])
		.pipe(assets)
		//.pipe($.rev())
		.pipe(jsFilter)
		//.pipe($.uglify({preserveComments: $.uglifySaveLicense}))
		.pipe($.uglify())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe($.replace('bower_components/bootstrap-sass/assets/fonts/bootstrap', 'fonts'))
		.pipe($.replace('bower_components/components-font-awesome/fonts', 'fonts'))
		.pipe($.csso())
		.pipe(cssFilter.restore)
		.pipe(assets.restore())
		.pipe($.useref())
		//.pipe($.revReplace())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});


gulp.task('dev', [], function () {
	var appjs = $.filter(['app/scripts/app.js'], {restore: true});
	var monitorjs = $.filter(['server/monitor-whatsapp.js'], {restore: true});

	return gulp.src(['**/*.js'])

		.pipe(appjs)
		.pipe($.replace('https://<FIREBASE_ID>.firebaseio.com', process.env.FIREBASE_DEV_URL))
		.pipe($.replace(process.env.FIREBASE_PROD_URL, process.env.FIREBASE_DEV_URL))
		.pipe(appjs.restore)

		.pipe(monitorjs)
		.pipe($.replace('https://<FIREBASE_ID>.firebaseio.com', process.env.FIREBASE_DEV_URL))
		.pipe($.replace(process.env.FIREBASE_PROD_URL, process.env.FIREBASE_DEV_URL))
		.pipe($.replace('\'<WHATSAPP_RECIPIENTS>\'', process.env.WHATSAPP_RECIPIENTS_DEV))
		.pipe($.replace(process.env.WHATSAPP_RECIPIENTS_PROD, process.env.WHATSAPP_RECIPIENTS_DEV))
		.pipe(monitorjs.restore)

		.pipe(gulp.dest('.'))
		.pipe($.size());
});

gulp.task('prod', [], function () {
	var appjs = $.filter(['app/scripts/app.js'], {restore: true});
	var monitorjs = $.filter(['server/monitor-whatsapp.js'], {restore: true});

	return gulp.src(['**/*.js'])

		.pipe(appjs)
		.pipe($.replace('https://<FIREBASE_ID>.firebaseio.com', process.env.FIREBASE_PROD_URL))
		.pipe($.replace(process.env.FIREBASE_DEV_URL, process.env.FIREBASE_PROD_URL))
		.pipe(appjs.restore)

		.pipe(monitorjs)
		.pipe($.replace('https://<FIREBASE_ID>.firebaseio.com', process.env.FIREBASE_PROD_URL))
		.pipe($.replace(process.env.FIREBASE_DEV_URL, process.env.FIREBASE_PROD_URL))
		.pipe($.replace('\'<WHATSAPP_RECIPIENTS>\'', process.env.WHATSAPP_RECIPIENTS_PROD))
		.pipe($.replace(process.env.WHATSAPP_RECIPIENTS_DEV, process.env.WHATSAPP_RECIPIENTS_PROD))
		.pipe(monitorjs.restore)

		.pipe(gulp.dest('.'))
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
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size());
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], {read: false}).pipe($.rimraf());
});

gulp.task('build', ['prod', 'html', 'images', 'fonts']);
