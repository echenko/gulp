import gulp from 'gulp';
import include from 'gulp-include';
import less from 'gulp-less';
import { deleteAsync } from 'del';
import browser from 'browser-sync';

const paths = {
    pages: {
        src: 'source/*.html',
        dest: 'public/'
    },
    includes: {
        src: 'source/components/**/',
    },
    styles: {
        src: 'source/styles/**/*.less',
        dest: 'public/styles/'
    },
    images: {
        src: 'source/images/**/*.{jpg,jpeg,png,svg}',
        dest: 'public/images/'
    },
    cleaner: {
        public: 'public',
        images: 'public/images'
    },
    server: {
        baseDir: 'public',
        index: 'index.html'
    },
    watcher: {
        pages: 'source/**/*.html',
        styles: 'source/**/*.less',
        images: 'source/images/**/*.{jpg,jpeg,png,svg}'
    }
}

// pages
export const pages = () => {
    return gulp.src(paths.pages.src)
        .pipe(include({ includePaths: paths.includes.src, }))
        .pipe(gulp.dest(paths.pages.dest))
}

// styles
export const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(gulp.dest(paths.styles.dest))
}

// images
export const images = () => {
    return gulp.src(paths.images.src, { encoding: false })
            .pipe(gulp.dest(paths.images.dest))
}

// cleaner
export const cleaner = () => {
    return deleteAsync(paths.cleaner.public, { read: false, allowEmpty: true })
}

// watch
export const watcher = () => {
    gulp.watch(paths.watcher.pages, pages).on('change', browser.reload)
    gulp.watch(paths.watcher.styles, styles).on('change', browser.reload)
    gulp.watch(paths.watcher.images, images).on('change', browser.reload)
}

// server
export const server = () => {
    browser.init({
        server: {
            baseDir: paths.server.baseDir,
            index: paths.server.index
        },
        port: 8080
    });
}

// start
export const start = gulp.series(
    cleaner,
    gulp.parallel(pages, styles, images),
    gulp.parallel(watcher, server)
)

// build
export const build = gulp.series(
    cleaner,
    pages,
    styles,
    images
)
