var del = require( 'del' ),
    pump = require( 'pump' ),
    gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    uglify = require( 'gulp-uglify' ),
    gls = require( 'gulp-live-server' ),
    sass = require( 'gulp-sass' ),
    ftp = require( 'vinyl-ftp' ),
    ftp_config = require( './ftp.config' ).config,
    src = 'src/*',
    dist = 'dist',
    server;


gulp.task( 'clean', function( done ) {
    del( [ dist ] );
    done();
} );

gulp.task( 'serve', function() {
    server = gls.static( dist, 8888 );
    server.start();

    gulp.watch( [ dist + '/**/*' ], function( file ) {
        server.notify.apply( server, [ file ] );
    } );
    gulp.watch( ['src/js/**', 'src/scss/**/*.scss'], gulp.parallel[ 'sass', 'uglify', 'templates' ] );
    // gulp.watch( 'src/js/**/*.js', [ 'uglify' ] );
    // gulp.watch( 'src/**/*.html', [ 'templates' ] );
} );

// gulp.task( 'watch', function( file ) {
//     gulp.watch( 'src/scss/**/*.scss', [ 'sass' ] );
//     gulp.watch( 'src/js/**/*.js', [ 'uglify' ] );
//     gulp.watch( 'src/**/*.html', [ 'templates' ] );
// } );

gulp.task( 'sass', function() {
    return gulp.src( './src/scss/**/*.scss' )
        .pipe( sass.sync().on( 'error', sass.logError ) )
        .pipe( gulp.dest( dist ) );
} );

// gulp.task( 'sass:watch', function() {
//     gulp.watch( './scss/**/*.scss', [ 'sass' ] );
// } );

gulp.task( 'templates', function() {
    return gulp.src( './src/**/*.html' )
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'images', function() {
    return gulp.src( './src/images/**/*.*' )
        .pipe( gulp.dest( dist + '/images' ) );
} );

gulp.task( 'uglify', function( cb ) {
    pump( [
            gulp.src( './src/js/**/*.js' ),
            uglify(),
            gulp.dest( dist )
        ],
        cb
    );
} );

// gulp.task( 'build', gulp.series( 'uglify', 'sass', function(done) {
//     done();
// }) );

gulp.task( 'deploy', gulp.series( 'uglify', 'sass', function() {

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
            base: './' + dist,
            buffer: false
        } )
        .pipe( conn.newer( '/public_html' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html' ) );

} ) );

gulp.task( 'default', gulp.series( 'clean', 'templates', 'images', 'sass', 'uglify', 'serve', function( done ) {
    done();
} ) );
