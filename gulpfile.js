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
    replace = require('gulp-replace'),
    del = require('del'),

    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    prefix = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    templateCache = require('gulp-angular-templatecache'),

    wiredep = require('wiredep').stream,

    inject = require('gulp-inject'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    streamSeries = require('stream-series'),
    filelist = require('gulp-filelist'),

    notify = require('gulp-notify'),
    //order = require('gulp-order'),
    debug = require('gulp-debug');

    
    
    var fs = require('fs');
    var args = require('minimist')(process.argv.slice(2));

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


// =======================================================================
var app_name=args['app'];
if(!app_name)app_name=args['a'];
if(!app_name)app_name='jia';

fs.stat("./app/app-"+app_name+".define.js", function(err, stat) {
  if(err){
    console.log("Err: Missing ./app/app-"+app_name+".define.js");
    process.exit(1);
  }
});

var configObj =require ( './gulpfile.app.js' )(app_name);

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
 *  s2a: build-loader
 *  仅注入 loader.js 的 index.html 版本
 *  其他css,js 都通过 loader.js 动态加载
 */
gulp.task('build-loader', function () {
  var src=configObj.path.app + '/'+configObj.html_src;
  
  var loaderJs=configObj.path.app + '/'+'loader.js';
  
  //1, 把loader.js里的路径替换掉，然后写入dist目录
  gulp.src(loaderJs)
    .pipe(replace("window.__assetsPath='../assets'",
        "window.__assetsPath='"+configObj.path.assets_dep_at+"'"))
    .pipe(uglify({compress: { drop_console: true }}))
    .pipe(gulp.dest(configObj.path.dist_app))
  
  //2, app-b.html 文件只注入loader.js，然后写入dist/imdex.html
  // (注，app-b.html注入全部js,css文件后，并用usref合并压缩的，
  //   是写入dist/imdex0.html，属于备用文件)
  return gulp.src( src )
    .pipe(inject(gulp.src(loaderJs, {read: false}), {relative: true}))
    .pipe(rename(configObj.dist_loader))
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true}))
    .pipe(gulp.dest(configObj.path.dist_app))
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
  
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  
    return gulp.src(configObj.path.app + '/'+configObj.html_debug)
        .pipe(useref())
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))


        .pipe(gulpif('*.js', replace("window.__assetsPath='../assets'",
          "window.__assetsPath='"+configObj.path.assets_dep_at+"'")))
        .pipe(gulpif('*.js',  uglify({compress: { drop_console: true }})))
        .pipe(rev()) 
        .pipe(revReplace()) 
        .pipe(gulpif('*.html', rename(configObj.dist_html)))
        .pipe(gulp.dest(configObj.path.dist_app)) 
      
        .pipe(debug({title:'a1 -'})) 
        .pipe(flatten())
        
        .pipe(jsFilter) 
        .pipe(filelist('js.json',{ relative: true }))
        .pipe(jsFilter.restore) 
        
        
        .pipe(cssFilter) 
        .pipe(filelist('css.json',{ relative: true }))
        .pipe(cssFilter.restore)
        
        .pipe(gulp.dest(configObj.path.dist_app)) 
      
      
});
gulp.task('copyImg', function() {
    return gulp.src(configObj.path.app_assets+'/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(configObj.path.dist_assets+'/img'))
});


//font-awesome 的字体文件
gulp.task('copyFonts1', function() {
  return gulp.src('bower_components/font-awesome/fonts/*.*')
    //.pipe(flatten())
    .pipe(gulp.dest(configObj.path.dist_assets+'/fonts'))
});


gulp.task('copy', ['copyFonts1','copyImg'], function(){

});;


gulp.task('runBuild', ['build-loader','html-useref','copy'], function(){
  fs.writeFile(configObj.path.tmp+'/'+configObj.tplJsName,'//clear after build');
});

gulp.task('default',['runBuild']);
