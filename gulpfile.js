const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')

function compilaSass() {
    return new Promise((done) => {
        gulp.src('./estilos/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' })
                .on('error', sass.logError))
            .pipe(concat('main.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./estilos/css'))
            .on('end', done)
    })
}

function observe() {
    compilaSass()
    gulp.watch('./estilos/scss/*.scss', compilaSass)
}

exports.default = observe;



