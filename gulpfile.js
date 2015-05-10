var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

// Path's to various places in the build process
var path = {
    HTML: 'src/index.html',
    ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
    JS: ['src/js/*.js', 'src/js/**/*.js'],
    MINIFIED_OUT: 'build.min.js',
    DEST_SRC: 'dist/src',
    DEST_BUILD: 'dist/build',
    DEST: 'dist'
};

//********** Build for Dev ****************************
// 1. Transform JSX into regular Javascript in this task
gulp.task('transform', function(){
   gulp.src(path.JS)
        .pipe(react())
        .pipe(gulp.dest(path.DEST_SRC));
});

// 2. Copy the existing index.html into our dist folder
gulp.task('copy', function(){
   gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});

// 3. Watch for changes to index.html or JS files in dev
//    run steps 1 & 2 if changes occur to those files
gulp.task('watch', function(){
   gulp.watch(path.ALL, ['transform', 'copy']);
});

// Default command to run when we enter gulp on the CLI
gulp.task('default', ['watch']);

//********** Build for Production ****************************
// 1. Concatenate all of our JS files together and minify them
gulp.task('build', function(){
    gulp.src(path.JS)
        .pipe(react())
        .pipe(concat(path.MINIFIED_OUT))
        .pipe(uglify(path.MINIFIED_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
});

// 2. Replace our JS file references wrapped in <!--build:js-->/
//    <!--endbuild--> with a reference to our single minified file
gulp.task('replaceHTML', function(){
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);