var del = require( 'del' ),
    gulp = require( 'gulp' ),
    gls = require( 'gulp-live-server' ),
    sass = require( 'gulp-sass' ),
    src = 'src/*',
    dist = 'dist',
    server;

gulp.task( 'default', [ 'clean', 'serve', 'watch', 'templates', 'images', 'sass', ] );

gulp.task( 'clean', function() {
    del( [ dist ] );
} );

gulp.task( 'serve', function() {
    server = gls.static( dist, 8888 );
    server.start();

    gulp.watch( [ dist + '/**/*' ], function( file ) {
        server.notify.apply( server, [ file ] );
    } );
} );

gulp.task( 'watch', function( file ) {
    gulp.watch( 'src/scss/**/*.scss', [ 'sass' ] );
    gulp.watch( 'src/js/**/*.js', [ 'scripts' ] );
    gulp.watch( 'src/**/*.html', [ 'templates' ] );
} );

gulp.task( 'sass', function() {
    return gulp.src( './src/scss/**/*.scss' )
        .pipe( sass.sync().on( 'error', sass.logError ) )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'sass:watch', function() {
    gulp.watch( './scss/**/*.scss', [ 'sass' ] );
} );

gulp.task( 'templates', function() {
    return gulp.src( './src/**/*.html' )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'images', function() {
    return gulp.src( './src/images/**/*.*' )
        .pipe( gulp.dest( dist + '/images') );
} );
