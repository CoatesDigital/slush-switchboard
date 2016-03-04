var gulp = require('gulp');
var sass = require('gulp-sass');
var zip = require('gulp-zip');
var webshot = require('gulp-webshot');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
	return gulp.src('./sass/**/*.scss')
					.pipe(sass().on('error', sass.logError))
					.pipe(gulp.dest('./public/css'))
					.pipe(browserSync.stream());
});

/**
 * Tasks for generating preview of index.html
 */
gulp.task('create-preview', ['sass'], function () {
	return gulp.src('./index.html')
					.pipe(webshot({
						dest:'./',
						root:'./',
						defaultWhiteBackground: true,
						screenSize: {
							width:<%= contentWidth %>,
							height:<%= contentHeight %>
						}
					}));
});

gulp.task('rename-preview', ['create-preview'], function () {
	return gulp.src('./index.png')
					.pipe(rename('preview.png'))
					.pipe(gulp.dest('./'));
});

gulp.task('start-preview', ['rename-preview'], function () {
	return gulp.src('./index.png')
					.pipe(clean());
})

/**
 * Master Tasks
 */
gulp.task('build', ['zip']);
gulp.task('zip', ['start-preview'], function () {
	gulp.src([
					'./**/*',
					'!./node_modules/',
					'!./sass/',
					'!./csv/',
					'!./**/*.zip'
				])
		    .pipe(zip('<%= zipFilename %>'))
		    .pipe(gulp.dest('./'));
});

gulp.task('serve', function () {
	browserSync.init({
		server: "./"
	});

	gulp.watch([
		"./**/*.html",
		"./**/*.js",
		"./**/*.css"
	]).on('change', browserSync.reload);
});

gulp.task('watch', function() {
	gulp.watch('./sass/**/*.scss', ['build']);

	gulp.watch([
		'./**/*.*',
		'!./css/**/*.*',
		'!./js/**/*.*',
		'!./preview.png'
	], ['build']);
});

gulp.task('default', ['build', 'watch', 'serve']);
