'use strict';
// =======================================================================
// Gulp Plugins
// =======================================================================

//var $ = require('gulp-load-plugins')();

var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),

    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename'),
    del = require('del'),

    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    prefix = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    templateCache = require('gulp-angular-templatecache'),

    wiredep = require('wiredep').stream,

    notify = require('gulp-notify'),
    //order = require('gulp-order'),
    debug = require('gulp-debug');

/*
1. dist 目录下直接放的文件只有两个
  index.html
  qgs-main.app-config.js
2. dist/assest 目录不直接放文件

3. dist/assest/js
   dist/assest/css
   dist/assest/img
   dist/assest/fonts
   3个子目录放静态文件 
   第4个目录放字体文件
   保持 css 和 fonts 相对路径不变。

*/
var configObj = {
  //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
  tplModule: 'appb',
  tplFile: 'tpl.js',

  //需要知道在 index.html 中定义的路径名和文件名， 以便合并 templatecache
  useref_jspath: 'assets/js',
  useref_jsfile: 'app.js',
  path: {
    tmp: './tmp',
    
    dist: './dist'
  }
}
    

// =======================================================================
// Error Handling
// =======================================================================
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}





gulp.task('templatecache', function () {
  return gulp.src('app/**/*.template.html')
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
    .pipe(templateCache(configObj.tplFile,{module: configObj.tplModule}))
    .pipe(gulp.dest(configObj.path.tmp));
});


gulp.task('html-useref',['wiredep'], function(){
    return gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))
        .pipe(gulp.dest(configObj.path.dist));

});
gulp.task('copyImg', function() {
    return gulp.src('app/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(configObj.path.dist+'/assets/img'))
});

gulp.task('copyCfg', function() {
    return gulp.src('app/qgs-main.app-config.js')
    .pipe(gulp.dest(configObj.path.dist))
});

//font-awesome 的字体文件
gulp.task('copyFonts1', function() {
    return gulp.src('app/bower_components/font-awesome/fonts/*.*')
    //.pipe(flatten())
    .pipe(gulp.dest(configObj.path.dist+'/assets/fonts'))
});


gulp.task('wiredep', function() {
    return gulp.src( 'app/appb.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('app'));
});

gulp.task('default', ['html-useref', 'templatecache','copyFonts1','copyImg','copyCfg'], function(){
  return gulp.src([configObj.path.dist+'/'+configObj.useref_jspath+'/'+configObj.useref_jsfile,
          configObj.path.tmp+'/'+configObj.tplFile])
    .pipe(concat(configObj.useref_jsfile))
    //.pipe(ngAnnotate())
    .pipe(uglify({compress: { drop_console: true }}))
    .pipe(gulp.dest(configObj.path.dist+'/'+configObj.useref_jspath));
});