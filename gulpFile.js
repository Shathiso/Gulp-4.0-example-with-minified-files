  
  
var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
del = require('del'),
useref = require('gulp-useref'),
browserSync = require('browser-sync').create();


// BrowserSync
gulp.task('browsersync', function (done) {
  browserSync.init({
    proxy: 'http://localhost:2000/wordpress-practice/',
    port: '2000',
		open: true,
    injectChanges: true
    });
    done();
});

const reload = done => {
	browserSync.reload();
	done();
};


gulp.task('sass', function() {
gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

//Compress and minify sass
gulp.task('styles', function() {
return sass('src/sass/main.scss', { style: 'expanded' })
  .pipe(autoprefixer('last 2 version'))
  .pipe(gulp.dest('dist/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cssnano())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
  .pipe(livereload())
  .pipe(notify({ message: 'Styles task complete' }));
});

//Compress Images
gulp.task('images', function() {
return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.stream())
  .pipe(notify({ message: 'Images task complete' }));
});

//Compress Script files
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*')
    .pipe(rename({suffix: '.min'}))
    .pipe(useref())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Script task complete' }));
  });

//Gulp Watch files
gulp.task('watch', function(){
  gulp.watch('src/sass/**/*', gulp.series('styles', reload))
  gulp.watch('src/js/**/*', gulp.series('scripts', reload))
  gulp.watch('src/images/**/*', gulp.series('images', reload))
});


gulp.task('serve',
gulp.series(
gulp.parallel(
'images',
'styles', 
'scripts',
'watch',
'browsersync'
))
);

// attach a default task, so when when just <code>gulp</code> the thing runs
gulp.task('default', gulp.series( 'serve'));
