const gulp = require('gulp');
const less = require('gulp-less');
const include = require('gulp-include');
const browser = require('browser-sync');
const fs = require('fs');


// default
function defaultTask(cb) {
    console.log('gulp is running...');
    cb()
}

// pages
function pages() {
    return gulp.src('source/*.html')
        .pipe(include({
            includePaths: './source/components/**/',
        }))
        .pipe(gulp.dest('public'))
        .pipe(browser.stream());
}

// styles
function styles() {
    return gulp.src('source/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('public/styles'))
        .pipe(browser.stream());
}

// server
function server() {
    browser.init({
        server: {
            baseDir: 'public',
        },
        cors: true,
        notify: false,
        ui: false,
    });
}

// watcher
function watcher() {
    gulp.watch('./source/**/*.html', gulp.parallel(pages), browser.reload);
    gulp.watch('./source/**/*.less', gulp.parallel(styles), browser.reload);
    gulp.watch('./source/fonts/**/*.*', gulp.parallel(copyFonts), browser.reload);
    gulp.watch('./source/images/**/*.*', gulp.parallel(copyImages), browser.reload);
}

// copy fonts
function copyFonts() {
    return gulp.src('./source/fonts/**/*')
        .pipe(gulp.dest('./public/fonts/'))
        .pipe(browser.stream());
}

// copy images
function copyImages() {
    return gulp.src('./source/images/**/*')
        .pipe(gulp.dest('./public/images/'))
        .pipe(browser.stream())
}

// clean fs
function fsClean(done) {
    fs.rmSync('./public/', { recursive: true, force: true })
    done();
}


// exports
exports.pages = pages;
exports.styles = styles;
exports.server = server;
exports.watcher = watcher;
exports.default = defaultTask;
exports.fsClean = fsClean;
exports.copyFonts = copyFonts;
exports.copyImages = copyImages;
exports.start = gulp.series(fsClean, pages, styles, copyFonts, copyImages, gulp.parallel(server, watcher));
exports.build = gulp.parallel(fsClean, pages, styles, copyFonts, copyImages);
