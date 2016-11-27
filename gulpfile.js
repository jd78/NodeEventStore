var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
    return gulp.src(['./test/cacheTest.js', './test/aggregateTest.js', './test/persistorTest.js',
        './test/hookTest.js', './test/configurationTest.js', './test/serializerTest.js'],
        { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .once('error', function (err) {
            console.error(err);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});