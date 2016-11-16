var gulp = require( 'gulp' );
var gls = require( 'gulp-live-server' );
var clean = require( 'gulp-clean' );

var src = 'src/*';
var dist = 'dist';

gulp.task( 'default', function() {
    gulp
        .src( src )
        // .pipe(gulpCopy(outputPath, options))
        // .pipe(otherGulpFunction())
        .pipe( gulp.dest( dist ) );
} );

gulp.task( 'serve', function() {
    //1. serve with default settings
    // var server = gls.static(); //equals to gls.static('public', 3000);
    // server.start();

    //2. serve at custom port
    var server = gls.static( dist, 8888 );
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch( [ 'static/**/*.css', 'static/**/*.html' ], function( file ) {
        server.notify.apply( server, [ file ] );
    } );
} );
