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
  xxx-config.js
  
2. dist/assest 目录放 js 文件

3. dist/assest/css
   dist/assest/img
   dist/assest/fonts
   3个子目录放对应的文件
   
   保持 css 和 fonts 相对路径不变。

*/

var config_appb = {
  //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
  tplModule: 'appb',
  
  tplFile: 'tpl.js',

  //需要知道在 index.html 中定义的路径名和文件名， 以便合并 templatecache
  useref_jspath: 'assets',
  useref_jsfile: 'app.js',
  
  //s1,手工写的html, 给wiredep处理的文件，处理后可以调试用，可以给useref用
  html_before_wiredep: 'app-b.html', 
  
  //s2,可以调试用，也是给useref处理的文件名
  html_after_wiredep: 'app-b-index.html', 
  
  //s3, 最终放到 dist 目录下的 html文件名
  html: 'index.html', 
  
  path: {
    file_copy: '',
    app: './app',    
    tmp: './tmp',
    
    dist: './dist'
  }
}
var config_exbook = {
  //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
  tplModule: 'appb',
  
  tplFile: 'tpl.js',

  //需要知道在 index.html 中定义的路径名和文件名， 以便合并 templatecache
  useref_jspath: 'assets',
  useref_jsfile: 'exbook.js',
  
  //s1,手工写的html, 给wiredep处理的文件，处理后可以调试用，可以给useref用
  html_before_wiredep: 'app-exbook.html', 
  
  //s2,可以调试用，也是给useref处理的文件名
  html_after_wiredep: 'app-exbook-index.html', 
  
  //s3, 最终放到 dist 目录下的 html文件名
  html: 'index.html', 
  
  path: {
    file_copy: '',
    app: './app',    
    tmp: './tmp',
    
    dist: './dist-exbook'
  }
}
 
// =======================================================================
var configObj =config_appb;

// =======================================================================

gulp.task('templatecache', function () {
  return gulp.src('app/**/*.template.html')
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
    .pipe(templateCache(configObj.tplFile,{module: configObj.tplModule}))
    .pipe(gulp.dest(configObj.path.tmp));
});

gulp.task('wiredep', function() {
    return gulp.src( configObj.path.app + '/'+configObj.html_before_wiredep )
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(rename(configObj.html_after_wiredep))
    .pipe(gulp.dest(configObj.path.app));
});

gulp.task('html-useref',['wiredep'], function(){
    return gulp.src(configObj.path.app + '/'+configObj.html_after_wiredep)
        .pipe(useref())
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))
        .pipe(gulpif('*.html', rename(configObj.html)))
        .pipe(gulp.dest(configObj.path.dist));
});
gulp.task('copyImg', function() {
    return gulp.src('app/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(configObj.path.dist+'/assets/img'))
});

gulp.task('copyFile', function() {
    return gulp.src(configObj.path.file_copy)
    .pipe(gulp.dest(configObj.path.dist))
});

//font-awesome 的字体文件
gulp.task('copyFonts1', function() {
    return gulp.src('app/bower_components/font-awesome/fonts/*.*')
    //.pipe(flatten())
    .pipe(gulp.dest(configObj.path.dist+'/assets/fonts'))
});


//gulp.task('copy', ['copyFonts1','copyImg','copyFile']);
gulp.task('copy', ['copyFonts1','copyImg']);


gulp.task('runBuild', ['html-useref', 'templatecache','copy'], function(){
  return gulp.src([configObj.path.dist+'/'+configObj.useref_jspath+'/'+configObj.useref_jsfile,
          configObj.path.tmp+'/'+configObj.tplFile])
    .pipe(concat(configObj.useref_jsfile))
    //.pipe(ngAnnotate())
    .pipe(uglify({compress: { drop_console: true }}))
    .pipe(gulp.dest(configObj.path.dist+'/'+configObj.useref_jspath));
});

gulp.task('config-appb', function(){
  console.log('set config to [appb]');
  configObj =config_appb;
});
gulp.task('config-exbook', function(){
  console.log('set config to [exbook]');
  configObj =config_exbook;
});

gulp.task('default',['config-appb','runBuild']);
gulp.task('exbook',['config-exbook','runBuild']);
