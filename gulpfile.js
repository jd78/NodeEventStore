var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('default', function () {
    return gulp.src(['./test/cacheTest.js', './test/configurationTest.js', './test/aggregateTest.js', './test/persistorTest.js'], 
        {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});