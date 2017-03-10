'use strict';

/**
 *  可构建多个APP，
 *  目前有两个APP： `app-b` AND `app-exbook`
 *  默认APP为 app-b
 *  
 *  总的任务：
 *  
 *  1, 使用 `gulp` 或 `gulp default` 构建 默认APP (`app-b`)
 *  2  使用 `gulp appb` 构建 `app-b`
 *  3, 使用 `gulp exbook` 构建 `app-exbook`
 *  
 *  详细 分步任务 列表：
 * 
 *  4, gulp wiredep  //根据bower.json 注入依赖的css和js到html中
 *  5, gulp useref   //合并html中的多个css和js
 *  6, gulp config-appb //修改配置为`app-b`，单独运行没用，放在别的任务前运行
 *  7, gulp config-exbook //修改配置为`app-exbook`，同上
 *  8,  ... 略
 *  
 *  一般 分步任务 均为对默认APP操作，
 *  如果对其他APP，需要在任务前加对应APP的配置任务，
 *  一定要同一条gulp命令运行多个任务才有效，单独运行没用。
 *  比如上面的4, 5, 对应app-exbook的任务应该如下：
 *  4, gulp config-exbook wiredep  //根据bower.json 注入依赖的css和js到html中
 *  5, gulp config-exbook useref   //合并html中的多个css和js
 */
 
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

    inject = require('gulp-inject'),
    rev = require('gulp-rev').
    revReplace = require('gulp-rev-replace'),
    streamSeries = require('stream-series'),

    notify = require('gulp-notify'),
    //order = require('gulp-order'),
    debug = require('gulp-debug');

    
    
    var fs = require('fs');

    //自动发布代码
    gulp.task('dep1', function () {
      fs.stat('./tmp/deploy.sftp.js', function(err, stat) {
        if(err == null) {
          console.log('File exists');
          var dep_1 = require('./tmp/deploy.sftp.js');
          return dep_1(configObj);
        } else {
          console.log('dep1 file error: ',err.code);
        }
      });

    })


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
  tplHtml: [//app后马上跟两个*号，否则路径的 base 不对，模板不能用
    './app/**/modules/**/*.template.html',
    './app/**/view-default/**/*.template.html',
    './app/**/view-test/**/*.template.html'],
  tplJsName: 'tpl_appb-sys.js',
  
  injects: [
    [
      './app/app-b.js'
    ], [
      './app/**/modules/**/*.module.js',
      '!./app/bower_components/**/*'
    ], [
      './app/**/modules/**/*.js',
      '!./app/**/*.module.js', 
      '!./app/bower_components/**/*'
    ], [
      './app/**/view-default/**/*.module.js',
      './app/**/view-test/**/*.module.js',
      '!./app/bower_components/**/*'
    ], [
      './app/**/view-default/**/*.js',
      './app/**/view-test/**/*.js',
      '!./app/**/*.module.js', 
      '!./app/bower_components/**/*'
    ], [
      './app/assets/js/common.js',
      "./app/assets/css/main.css"
    ], [
      "./app/view-default/appb.css"
    ]
  ],

  //s1,手工写的html, 给wiredep处理的文件，处理后可以调试用，可以给useref用
  html_src: 'app-b.html', 
  
  //s2,可以调试用，也是给useref处理的文件名
  html_debug: 'index-b.html', 
  
  //s3, 最终放到 dist 目录下的 html文件名
  html_dist: 'index.html', 
  
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
  tplHtml: [//app后马上跟两个*号，否则路径的 base 不对，模板不能用
    './app/**/modules/**/*.template.html',
    './app/**/view-exbook/**/*.template.html'],
  tplJsName: 'tpl_exbook.js',
  
  injects: [
    [
      './app/app-exbook.js'
    ], [
      './app/**/modules/**/*.module.js',
      '!./app/bower_components/**/*'
    ], [
      './app/**/modules/**/*.js',
      '!./app/**/*.module.js', 
      '!./app/bower_components/**/*'
    ], [
      './app/**/view-exbook/**/*.module.js',
      '!./app/bower_components/**/*'
    ], [
      './app/**/view-exbook/**/*.js',
      '!./app/**/*.module.js', 
      '!./app/bower_components/**/*'
    ], [
      './app/assets/js/common.js',
      "./app/assets/css/main.css"
    ], [
      "./app/view-exbook/exbook.css"
    ]
  ],
 
  
  
  
  //s1,手工写的html, 给ng-inject, wiredep处理的文件，处理后可以调试用，可以给useref用
  html_src: 'app-b.html', 
  
  //s2,可以调试用，也是给useref处理的文件名
  html_debug: 'index.html', 
  
  //s3, 最终放到 dist 目录下的 html文件名
  html_dist: 'index.html', 
  
  path: {
    file_copy: '',
    app: './app',    
    tmp: './tmp',
    
    dist: './dist-exbook'
  }
}


// =======================================================================
var configObj =config_exbook;

// =======================================================================


/**
 *  s1: templatecache
 *  把模板文件打包成JS文件，放在TMP目录下
 *  并登记到 configObj.injects 中，后面可自动注入
 */
gulp.task('templatecache', function () {
  
  //登记到 configObj.injects 中，后面可自动注入
  configObj.injects.push([configObj.path.tmp+'/'+configObj.tplJsName]);
  
  console.log('tplModule=',configObj.tplModule);
  //把模板文件打包成JS文件，放在TMP目录下
  return gulp.src(configObj.tplHtml)
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
    .pipe(templateCache(configObj.tplJsName,{module: configObj.tplModule}))
    .pipe(gulp.dest(configObj.path.tmp));
});

/**
 *  s2: inject
 *  注入 APP 的 js 和 css
 *  这里也会注入 步骤s1 templatecache 生成的 模板 js 文件。
 */
gulp.task('inject', ['templatecache'],function () {
  var src=configObj.path.app + '/'+configObj.html_src;
  var streams=[];
  configObj.injects.forEach(function(v,k){
    streams[k]=gulp.src(v, {read: false});
  })
  return gulp.src( src )
    .pipe(inject(streamSeries(streams), {relative: true}))
    .pipe(rename(configObj.html_debug))
    .pipe(gulp.dest(configObj.path.app))
});

/**
 *  s3: wiredep
 *  注入 bower components
 */
gulp.task('wiredep', ['inject'], function() {
    return gulp.src( configObj.path.app + '/'+configObj.html_debug )
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    //.pipe(rename(configObj.html_debug))
    .pipe(gulp.dest(configObj.path.app));
});

/**
 *  s4: html-useref
 *  把 css js 合并
 */
gulp.task('html-useref',['wiredep'], function(){
    return gulp.src(configObj.path.app + '/'+configObj.html_debug)
        .pipe(useref())
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))
        .pipe(gulpif('*.html', rename(configObj.html_dist)))
        .pipe(gulpif('*.js',  uglify({compress: { drop_console: true }})))
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


gulp.task('runBuild', ['html-useref','copy'], function(){
  return/* gulp.src([configObj.path.dist+'/'+configObj.useref_jspath+'/'+configObj.useref_jsfile,
          configObj.path.tmp+'/'+configObj.tplFile])
    .pipe(concat(configObj.useref_jsfile))
    //.pipe(ngAnnotate())
    .pipe(uglify({compress: { drop_console: true }}))
    .pipe(gulp.dest(configObj.path.dist+'/'+configObj.useref_jspath));*/
});

gulp.task('config-appb', function(){
  console.log('set config to [appb]');
  configObj =config_appb;
});
gulp.task('config-exbook', function(){
  console.log('set config to [exbook]');
  configObj =config_exbook;
});

gulp.task('default',['config-exbook','runBuild']);
gulp.task('appb',['config-appb','runBuild']);
gulp.task('exbook',['config-exbook','runBuild']);
