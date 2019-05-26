var gulp = require('gulp');
 
// 压缩html
// gulp插件应用 下载插件 取到插件 应用插件
var htmlClean = require('gulp-htmlclean');

// 压缩图片
var imageMin = require('gulp-imagemin');

// 压缩js
var uglify = require('gulp-uglify');

// 去掉js中的调试语句
var stripDebug = require('gulp-strip-debug');

// 将less转化为css
var less = require('gulp-less');

// 压缩css
var cleanCss = require('gulp-clean-css');

// postcss  autoprefixer 自动添加前缀
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// 开启服务器
var connect = require('gulp-connect');

var folder = {
    src: 'src/',
    dist: 'dist/'
}

// 判断当前环境变量
// export NODE_ENV=development 设置环境变量
var devMod = process.env.NODE_ENV == 'development';


gulp.task('html', function () {
    var page = gulp.src(folder.src + 'html/*')
        .pipe(connect.reload()) // 自动刷新
        if(!devMod) {
            page.pipe(htmlClean()) // 如果处于开发环境，则不进行压缩
        }
        page.pipe(gulp.dest(folder.dist + 'html/'))
})

gulp.task('image', function () {
    gulp.src(folder.src + 'images/*')
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + 'images/'))
})

gulp.task('css', function () {
    var page = gulp.src(folder.src + 'css/*')
        .pipe(connect.reload()) // 自动刷新
        .pipe(less())
        .pipe(postCss([autoprefixer()]))
        if(!devMod) {
            page.pipe(cleanCss())
        }   
        page.pipe(gulp.dest(folder.dist + 'css/'))
})

gulp.task('js', function () {
    var page = gulp.src(folder.src + 'js/*')
        .pipe(connect.reload()) // 自动刷新       
        if(!devMod) {
            page.pipe(stripDebug())
                .pipe(uglify())
        } 
        page.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task('server', function () {
    connect.server({
        port: '8080',
        livereload: true // 自动刷新
    });
})

// 监听文件变化
gulp.task('watch', function () {
    gulp.watch(folder.src + 'html/*', ['html']);
    gulp.watch(folder.src + 'css/*', ['css']);
    gulp.watch(folder.src + 'js/*', ['js']);
})

gulp.task('default', ['html', 'css', 'js', 'image', 'server', 'watch']);

// gulp.src()
// gulp.dest()
// gulp.task()
// gulp.watch()


// runner Task      ----gulp
// module bundle    ----webpack