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
    del = require('del');


gulp.task('sass', function() {
    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});

//Compress and minify sass
gulp.task('styles', function() {
    return sass('assets/sass/child-styles.scss', { style: 'expanded' })
      .pipe(autoprefixer('last 2 version'))
      .pipe(gulp.dest('./build/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano())
      .pipe(gulp.dest('./build/css'))
      .pipe(notify({ message: 'Styles task complete' }));
  });

//Compress Images
  gulp.task('images', function() {
    return gulp.src('assets/images/**/*')
      .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
      .pipe(gulp.dest('build/img'))
      .pipe(notify({ message: 'Images task complete' }));
  });

//Cleaning out destination folders
  gulp.task('clean', function() {
    return del(['build/css', 'build/img']);
});

//Gulp Watch 
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('assets/sass/**/*.scss', ['styles']);
  
    // Watch image files
    gulp.watch('assets/images/**/*', ['images']);
    
     // Create LiveReload server
     livereload.listen();

     // Watch any files in dist/, reload on change
     gulp.watch(['build/**']).on('change', livereload.changed);

});

    
gulp.task('serve', gulp.series('clean',
  gulp.parallel(
    'images',
    'styles')));
 
// attach a default task, so when when just <code>gulp</code> the thing runs
gulp.task('default', gulp.series('serve'));