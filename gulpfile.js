var del = require( 'del' ),
    gulp = require( 'gulp' ),
    gls = require( 'gulp-live-server' ),
    sass = require( 'gulp-sass' ),
    gutil = require( 'gulp-util' ),
    ftp = require( 'vinyl-ftp' ),
    ftp_config = require( './ftp.config' ).config,
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
        .pipe( gulp.dest( dist + '/images' ) );
} );

gulp.task( 'deploy', function() {

    console.info('ftp_config.host', ftp_config);
    var conn = ftp.create( {
        host: ftp_config.host,
        user: ftp_config.user,
        password: ftp_config.password,
        parallel: 10,
        log: gutil.log
    } );

    var globs = [ dist + '/**' ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, {
            base: './dist',
            buffer: false
        } )
        .pipe( conn.newer( '/public_html' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html' ) );

} );
