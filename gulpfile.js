var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');


function test(done){
    console.log("Hi!");
    done();
}


function reload(done){
    browserSync.reload();
    done();
}


function style(done){
    gulp.src('app/styles/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/styles/css'))
        .pipe(browserSync.stream());
    done();
}


function stylemax(done){
    gulp.src('app/styles/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('app/styles/css'))
        .pipe(browserSync.stream());
    done();
}


function watch(done){
    gulp.watch("app/styles/scss/**/*", style);
    gulp.watch("app/index.html", reload);
    gulp.watch('app/scripts/js/**/*', reload);
    done();
}


function sync(done){
    browserSync.init({
        server: {
            baseDir: "app"
        },
        port: 3000
    });
    done();
}


function collect(done){
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('build'));  
    gulp.src('app/styles/css/**/*.css')
        .pipe(gulp.dest('build/css'));  
    gulp.src('app/scripts/js/**/*.js')
        .pipe(gulp.dest('build/js'));      
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));  
    gulp.src('app/images/**/*.*')
        .pipe(gulp.dest('build/img'));
    done();
}


async function clean(done){
    del.sync('build');
    done();
}


gulp.task(test);
gulp.task(reload);
gulp.task(style);
gulp.task(stylemax);
gulp.task(watch);
gulp.task(sync);
gulp.task(collect);
gulp.task(clean);


gulp.task('build', gulp.series(clean, collect));
gulp.task('default', gulp.parallel(watch, sync));
