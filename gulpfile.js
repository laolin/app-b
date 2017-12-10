'use strict';

/**
 *  可构建多个APP，
 *  开发一个APP(假设app名为 XXX)需要一个目录和一个文件：
 *      `app/app-XXX.define.js`文件 和 `app/app-XXX`目录
 *  
 *  ===========================
 *  gulp 任务使用：
 *  ===========================
 *  
 *  0, 支持多APP，默认APP名是：jia
 *  
 *  - 通过用参数指定APP，例：`gulp --app XXX` 构建 名为 XXX 的app
 *  - 也可简写为 `gulp -a XXX
 *  
 *  1, `gulp dev` 在src目录注入必要的文件，用于调试（任务内容少）
 *
 *  2, `gulp bu` 或 `gulp build` 构建APP（任务内容多）
 *  
 *  3, *** - 目前还有一个没写完可将就用的自动发布任务:  `gulp dep1`
 *  
 *  4, `gulp` 或 `gulp default` 相当于 `gulp dev`
 *  
 *  ===========================
 *  详细任务 列表：
 *  ===========================
 *  
 *  s1: `templatecache` : angular template 的(*.template.html) 打包至js文件(tmp/tlp_XXX.js)
 *  s2: `inject` : 全部js,css注入app/app-b.html 中，生成app/index.html，方便开发调试
 *    参见gulpfile.js中的inject部分
 *  s3: `wiredep` : 注入 bower components 
 *  s4: `html-useref` : 把 css js 合并
 *    生成 css.json js.json 文件到 dist-app/目录下，供loader.js使用
 *  
 *  A : `build-loader` : app-b.html 中仅注入 loader.js 的 index.html 版本，详见loader.js中的注释
 *  
 *  B : `copy` : 复制 需要的js,img文件到dist-app 目录下
 *  
 *  `build` : = ['build-loader','html-useref','copy']
 *  `default` : 同`dev`
 *  `dev` : = ['build-loader','wiredep']
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
1. dist/APP_NAME 目录下放的文件有:
  (1), index0.html (运行时没有用)
  (2), index.html
  (3), css.json (运行时没有用)
  (4), js.json (运行时没有用)
  (5), loader.js
  
  正常只要有(1)index0.html一个文件就够了
  但是由于 微信会缓存文件，
    所以把变化的文件名都移出来，
    放在(3),(4)文件中，
    留下不变的内容为文件(2)index.html
  然后通过 gulp 构建时
    通过读3,4文件把文件名写入(5)loader.js
  
  详见 loader.js 中的注解。

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
  
  
  //console.log('tplModule=',configObj.tplModule);
  //把模板文件打包成JS文件，放在TMP目录下
  return gulp.src(configObj.tplHtml)
    //.pipe(order(['app/**.html'])) //无法排序，不修改每次重建结果也都不一样 :(
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
 *  
 *  同时生成 css.json js.json 文件到 dist-app/目录下，供loader.js使用
 */
gulp.task('html-useref',['wiredep'], function(){
  
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  
    return gulp.src(configObj.path.app + '/'+configObj.html_debug)
        .pipe(useref())
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))


        .pipe(gulpif('*.js',  uglify({compress: { drop_console: true }})))
        .pipe(rev()) 
        .pipe(revReplace()) 
        .pipe(gulpif('*.html', rename(configObj.dist_html)))
        .pipe(debug({title:'userefFiles : '})) 
        .pipe(gulp.dest(configObj.path.dist_app)) 
      
        //.pipe(debug({title:'a1 -'})) 
        .pipe(flatten())
        
        .pipe(jsFilter) 
        //.pipe(debug({title:'BBB1 -'})) 
        .pipe(filelist('js.json',{ relative: true }))
        .pipe(jsFilter.restore) 
        //.pipe(debug({title:'bbbbbbb1 @@'})) 
        
        
        .pipe(cssFilter) 
        //.pipe(debug({title:'BBBBBBBBB2 -'})) 
        .pipe(filelist('css.json',{ relative: true }))
        .pipe(cssFilter.restore)
        //.pipe(debug({title:'bbbbbbbbbbbbbbbbbb2 @@'})) 
        
        //.pipe(debug({title:'a2 -'})) 
        .pipe(gulp.dest(configObj.path.dist_app)) 
      
      
});


/**
 *  s5: build-loader
 *  app-b.html 中仅注入 loader()函数 生成 index.html
 *  其他css,js 都是通过 loader.js 来动态加载
 */
gulp.task('build-loader', ['html-useref'], function () {
  var src=configObj.path.app + '/'+configObj.html_src;
  var loaderJs=configObj.path.app + '/'+'loader.js';
  
  //------------------------------------------------
  //1, 把loader.js里的css,js文件列表替换掉，然后写入dist目录
  var alljs =require ( './'+configObj.path.dist_app+'/js.json');
  var allcss =require ( './'+configObj.path.dist_app+'/css.json');
  
  //获取真实的js,css文件名
  //确保加载顺序，库的文件名是1-xxx.js，项目的文件名是2-xxx.js
  alljs.sort();
  allcss.sort();
  alljs=JSON.stringify(alljs);
  allcss=JSON.stringify(allcss);

  gulp.src(loaderJs)
    //替换 真实的js,css文件名
    .pipe(replace("[];/*!!__ALLJS__!!*/",alljs))
    .pipe(replace("[];/*!!__ALLCSS__!!*/",allcss))
    .pipe(uglify({compress: { drop_console: true }}))
    .pipe(gulp.dest(configObj.path.dist_app))
  
  
  //------------------------------------------------
  //2, app-b.html 文件只注入loader()函数，
  //   然后写入dist/imdex.html
  //
  // (注，app-b.html注入全部js,css后，
  //   是app/index.html
  //   用于调试。
  // app/index.html用usref合并压缩后，
  //   是写入dist/imdex0.html，属于备用文件)
  var depAss=configObj.path.assets_dep_at;
  
  var loader=function(){
    return function(ass,app){
      window.__assetsPath=ass;
      var el=document.createElement("script")
      el.setAttribute("type","text/javascript")
      el.setAttribute("src", ass+'/../'+app+'/loader.js?_'+(+new Date))
      document.getElementsByTagName("head")[0].appendChild(el)
    }
  }();
  
  var jsDep="<script>("+
    loader.toString()+
  ")('"+depAss+"','"+app_name+"')</script>";
  return gulp.src( src )
    .pipe(replace("</body>",
        jsDep+"</body>"))//在 index.html 最后添加<srcipt>
        
    .pipe(htmlmin({collapseWhitespace: true,removeComments: true,minifyJS:true}))
    .pipe(rename(configObj.dist_loader))
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


gulp.task('build', ['build-loader','html-useref','copy'], function(){
  fs.writeFile(configObj.path.tmp+'/'+configObj.tplJsName,'//clear after build');
});

gulp.task('bu',['build']);
gulp.task('default',['dev']);
gulp.task('dev',['wiredep'], function(){
  fs.writeFile(configObj.path.tmp+'/'+configObj.tplJsName,'//clear after build');
});
