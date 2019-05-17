const { src, dest, watch, parallel } = require('gulp'); 
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

function sassToCss(done){
    src("./public/source/sass/app.scss")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest("./public/dist/css/"))
        .pipe(browserSync.stream());

    done();
}

// function doBrowserSync(){
//     browserSync.init({
//         server: {
//             baseDir: './'
//         }
//     })
// }

watch("./public/source/sass/**/*.scss", sassToCss) // **/* => elke van deze file in eender van onderliggend mapje */

module.exports.default = parallel(sassToCss);