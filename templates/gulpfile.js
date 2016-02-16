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

gulp.task('js', function() {
	return gulp.src('./js/**/*.js')
					.pipe(gulp.dest('./public/js'));
});

/**
 * Tasks for generating preview of index.html
 */
gulp.task('create-preview', ['sass', 'js'], function () {
	return gulp.src('./public/index.html')
					.pipe(webshot({
						dest:'public',
						root:'public',
						defaultWhiteBackground: true,
						screenSize: {
							width:<%= contentWidth %>,
							height:<%= contentHeight %>
						}
					}));
});

gulp.task('rename-preview', ['create-preview'], function () {
	return gulp.src('./public/index.png')
					.pipe(rename('preview.png'))
					.pipe(gulp.dest('./public'));
});

gulp.task('start-preview', ['rename-preview'], function () {
	return gulp.src('./public/index.png')
					.pipe(clean());
})

/**
 * Master Tasks
 */
gulp.task('build', ['zip']);
gulp.task('zip', ['start-preview'], function () {
	gulp.src('public/**/*')
		    .pipe(zip('<%= zipFilename %>'))
		    .pipe(gulp.dest('./'));
});

gulp.task('serve', function () {
	browserSync.init({
		server: "./public"
	});

	gulp.watch([
		"public/**/*.html",
		"public/**/*.js"
	]).on('change', browserSync.reload);
});

gulp.task('watch', function() {
	gulp.watch('./sass/**/*.scss', ['build']);
	gulp.watch('./js/**/*.js', ['build']);

	gulp.watch([
		'./public/**/*.*',
		'!./public/css/**/*.*',
		'!./public/js/**/*.*',
		'!./public/preview.png'
	], ['build']);
});

gulp.task('default', ['build', 'watch', 'serve']);
