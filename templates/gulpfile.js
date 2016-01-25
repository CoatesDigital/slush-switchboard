var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

gulp.task('sass', function() {
	gulp.src('./sass/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
	gulp.src('./js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('zip', function () {
	gulp.src('public/*')
	    .pipe(zip('<%= zipFilename %>'))
	    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch('./js/**/*.js', ['js']);
	gulp.watch('./public/**/*.*', ['zip']);
});

gulp.task('prod', ['sass', 'js']);
gulp.task('default', ['prod', 'watch']);
