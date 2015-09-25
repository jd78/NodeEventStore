var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('default', function () {
    return gulp.src('./test/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});