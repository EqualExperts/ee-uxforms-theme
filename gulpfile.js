const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');
const pkg = require('./package.json');
const kss = require('kss');
const watch = require('gulp-watch');
const connect = require('gulp-connect');

const TARGET_DIR = './target';
const SOURCE_DIR = './source';

function artifactName(extension) {
    return pkg.name + '-' + pkg.version + extension
}


gulp.task('sass', () => {
    return gulp.src(SOURCE_DIR + '/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(TARGET_DIR + '/stylesheets'))
        .pipe(connect.reload());
});

gulp.task('kss', ['sass'], () => {
    return kss({
        title: 'UXForms',
        source: SOURCE_DIR + '/scss',
        destination: TARGET_DIR + '/docs',
        mask: '*.scss',
        css: ['../stylesheets/main.css', '../stylesheets/theme.css'],
        homepage: '../../README.md',
        'nav-depth': 3
    });
});

gulp.task('static', () => {
    return gulp.src(SOURCE_DIR + '/static/**')
        .pipe(gulp.dest(TARGET_DIR))
        .pipe(connect.reload());
});

gulp.task('html', () => {
    gulp.src(TARGET_DIR + '/docs/*.html')
        .pipe(connect.reload());
});

gulp.task('clean', (c) => {
    return del(TARGET_DIR, c);
});

gulp.task('package', ['sass', 'static'], () => {
    return gulp.src(TARGET_DIR + '/**')
        .pipe(zip(artifactName('.zip')))
        .pipe(gulp.dest(TARGET_DIR))
});

gulp.task('connect', () => {
    connect.server({root: TARGET_DIR, port: 8090, livereload: true});
});

gulp.task('watch', () => {
    gulp.watch([TARGET_DIR + '/docs/*.html'], ['html']);
    gulp.watch(SOURCE_DIR + '/scss/**/*.scss', ['kss']);
    gulp.watch(SOURCE_DIR + '/static/**', ['static']);
});

gulp.task('default', ['clean'], (d) => {
    return runSequence('kss', 'static', 'connect', 'watch', d);
});

gulp.task('build', ['clean'], (d) => {
    return runSequence('package', d);
});
