const { src, dest, watch, parallel, series } = require('gulp'); 
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const minify = require('gulp-minify');
const nodemon = require('gulp-nodemon');


//compile all SASS to CSS
function sassToCss(done){
    src("./public/source/sass/app.scss")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest("./public/dist/css/"))
        .pipe(browserSync.stream());

    done();
}


//minify all JS files
function minifyJs(done){
    src("./public/javascripts/*.js")
        .pipe(minify())
        .pipe(dest("./public/javascripts/minified/"));

    done();
}


//start local server via nodemon
function startNodemon(done){
    nodemon({
        script: './bin/www',
        ext: "pug js",
        env: { 'NODE_ENV': 'development' },
        done: done
    });
}



watch("./public/source/sass/**/*.scss", sassToCss) // **/* => elke van deze file in eender van onderliggend mapje */

module.exports.default = series(sassToCss, minifyJs, startNodemon);