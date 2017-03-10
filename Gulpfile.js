// Base Gulp File
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssBase64 = require('gulp-css-base64'),
    path = require('path'),
    notify = require('gulp-notify'),
    inlinesource = require('gulp-inline-source'),
    browserSync = require('browser-sync'),
    // imagemin = require('gulp-imagemin'),
    del = require('del'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence');

// Task to compile SCSS
gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: false,
      paths: [ path.join(__dirname, 'scss', 'includes') ]
    })
    .on("error", notify.onError(function(error) {
      return "Failed to Compile SCSS: " + error.message;
    })))
    .pipe(cssBase64())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify("SCSS Compiled Successfully :)"));
});

// Task to Minify JS
// gulp.task('jsmin', function() {
//   return gulp.src('./js/**/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('./js/dist/'));
// });

// // Minify Images
// gulp.task('imagemin', function (){
//   return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
//   // Caching images that ran through imagemin
//   .pipe(cache(imagemin({
//       interlaced: true
//     })))
//   .pipe(gulp.dest('./dist/img'));
// });

// BrowserSync Task (Live reload)
gulp.task('browserSync', function() {
   browserSync.init({
        proxy: "localhost:8888/wc-html-to-wp/"
    });
});

// Gulp Inline Source Task
// Embed scripts, CSS or images inline (make sure to add an inline attribute to the linked files)
// Eg: <script src="default.js" inline></script>
// Will compile all inline within the html file (less http requests - woot!)
// gulp.task('inlinesource', function () {
//   return gulp.src('./src/**/*.html')
//     .pipe(inlinesource())
//     .pipe(gulp.dest('./dist/'));
// });

// Gulp Watch Task
gulp.task('watch', ['browserSync'], function () {
   gulp.watch('./scss/**/*', ['sass']).on('change', browserSync.reload);
   // gulp.watch('./src/**/*.html').on('change', browserSync.reload);
});

// Gulp Clean Up Task
// gulp.task('clean', function() {
//   del('dist');
// });

// Gulp Default Task
gulp.task('default', ['watch', 'sass']);

// Gulp Build Task
gulp.task('build', function() {
  runSequence('clean', 'sass', 'imagemin', 'jsmin', 'inlinesource');
});