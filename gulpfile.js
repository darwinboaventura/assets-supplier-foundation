const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const svgSprite = require('gulp-svg-sprite');
const connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const copy = require('copy');

// Compila SASS para CSS

gulp.task('sass', function() {
    sass('src/sass/**/*.sass')
    .on('error', sass.logError)
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(connect.reload());
});

// Gerar Sprite com os SVGS

gulp.task('svg', function() {
    gulp.src('src/svgs/**/*.svg')
    .pipe(plumber())
    .pipe(svgSprite({
        mode: {
            // symbol mode to build the SVG
            symbol: {
                render: {
                    // CSS output option for icon sizing
                    css: false,
                    // SCSS output option for icon sizing
                    scss: false
                },
                    // destination folder
                    dest: '.',
                    // generated sprite name
                    sprite: 'sprite.svg',
                    // build a sample page to the svg icon set
                    example: true
                }
            }
    }))
    .on('error', function(error){ console.log(error); })
    .pipe(gulp.dest('public/assets/svg/'))
    .pipe(connect.reload());
});

// Copia arquivos estáticos

gulp.task('copy', function() {
    copy('src/html/**/*.html', 'public/', function(err, files) {
        if (err) throw err;
    });

    gulp.src('src/html/**/*.html').pipe(connect.reload());
});

// Watch mudanças nos arquivos
gulp.task('watch', function() {
    gulp.watch('src/html/**/*.html', ['copy']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/svgs/**/*.svg', ['svg']);
});

// Conecta o server e ativa o LiveReload

gulp.task('connect', function() {
    connect.server({
        livereload: true,
        root: 'public'
    });
});

// Define o padrão ao rodar `gulp`

gulp.task('default', ['connect', 'watch']);