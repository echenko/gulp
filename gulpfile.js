import gulp from 'gulp';
import include from 'gulp-include';
import less from 'gulp-less';
import { deleteAsync } from 'del';
import browser from 'browser-sync';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';


// paths
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
    fonts: {
        src: 'source/fonts/**/*.{woff,woff2,ttf}',
        dest: 'public/fonts/'
    },
    cleaner: {
        public: 'public',
        images: 'public/images/**/*.{jpg,jpeg,png,svg}',
        fonts: 'public/fonts/**/*.{woff,woff2,ttf}',
    },
    server: {
        baseDir: 'public',
        index: 'index.html'
    },
    watcher: {
        pages: 'source/**/*.html',
        styles: 'source/**/*.less',
        images: 'source/images/**/*.{jpg,jpeg,png,svg}',
        fonts: 'source/fonts/**/*.{woff,woff2,ttf}'
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
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest))
}

// fonts
export const fonts = () => {
    return deleteAsync(paths.cleaner.fonts, { read: false, allowEmpty: true }),
        gulp.src(paths.fonts.src)
            .pipe(gulp.dest(paths.fonts.dest))
}

// images
export const images = () => {
    return deleteAsync(paths.cleaner.images, { read: false, allowEmpty: true }),
        gulp.src(paths.images.src, { encoding: false })
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
    gulp.watch(paths.watcher.fonts, fonts).on('change', browser.reload)
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
    gulp.parallel(pages, styles, images, fonts),
    gulp.parallel(watcher, server)
)

// build
export const build = gulp.series(
    cleaner,
    pages,
    styles,
    images,
    fonts
)
