var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gls = require( 'gulp-live-server' );
var sass = require( 'gulp-sass' );
var dist = 'dist';

var paths = {
  scripts: ['src/js/**/*.js'],
  templates: ['src/*.html'],
  css: ['src/scss/**/*.scss'],
  images: 'src/images/**/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([dist]);
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist));
});

// Run web server
gulp.task( 'serve', function() {
    server = gls.static( dist, 8888 );
    server.start();

    gulp.watch( [ 'src/**' ], function( file ) {
        server.notify.apply( server, [ file ] );
    } );
} );

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dist + '/images'));
});

// Copy HTML files
gulp.task( 'templates', function() {
    return gulp.src( paths.templates )
        .pipe( gulp.dest( dist ) );
} );

// Process SASS
gulp.task( 'sass', function() {
    return gulp.src( './src/scss/**/*.scss' )
        .pipe( sass.sync().on( 'error', sass.logError ) )
        .pipe( gulp.dest( dist ) );
} );

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']); // not really important to watch
  gulp.watch(paths.css, ['sass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['templates', 'sass', 'scripts', 'images', 'watch']);
