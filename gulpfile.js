'use strict';
/*
==【app-b 框架说明】==================================

一，多 APP 支持

1. 程序源文件：
 *  app-b 程序框架 支持多APP。
 *  在 /app/modules/ 目录下框架系统文件，或共用的模块。
 *  在 /app/app-XXX/ 每个目录是一个APP
 *  可以通过gulp构建多个APP，
 *  默认APP名是：steefac
 *  
 *  新建一个APP(假设app名为 XXX)需要一个目录和一个文件：
 *    `app/app-XXX.define.js`文件 和 `app/app-XXX`目录
 *  
 *  
 *  - 在用gulp命令构建APP时，通过lk --app 参数指定APP名
 *  - 也可简写为 `gulp -a XXX
 *    例：`gulp --app XXX bu` 构建 名为 XXX 的app
 *        `gulp -a exbook bu`
 *        `gulp -a steefac bu`
 *        `gulp -a steefac dev`

二、构建后的APP文件
1. 构建完成后，在 /dist/APP_NAME 目录下放的文件有:
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
    通过读(3),(4)文件把文件名写入(5)loader.js
  然后通过 gulp 布署时
    也是通过读(3),(4)文件获得需要布署的把文件

2. /dist/assets目录
  (6)APP的主要内容由js,css,img,fonts组成。
    js,css,img,fonts均放在 /dist/assets目录下。
  
3. 自动构建生成的APP文件路径示意：
  
├─DIST_ROOT
│  ├─assets 【 window.__assetsPath 指向这里 】
│  │  ├─js
│  │  ├─css
│  │  ├─fonts
│  │  └─img
│  │     ├─img-appName1
│  │     ├─img-appName2
│  │     └─img-appNameN
│  ├─appName1
│  │  ├─index.html (此文件要布署在本地服务器)
│  │  ├─css.json (2个json文件仅供gulp.js使用，运行时不需要)
│  │  ├─js.json (2个json文件仅供gulp.js使用，运行时不需要)
│  │  └─loader.js
│  ├─appName2
│  │  ├─index.html (此文件要布署在本地服务器)
│  │  ├─css.json (2个json文件仅供gulp.js使用，运行时不需要)
│  │  ├─js.json (2个json文件仅供gulp.js使用，运行时不需要)
│  │  └─loader.js
│  └─appNameN
│     ├─index.html (此文件要布署在本地服务器)
│     ├─css.json (2个json文件仅供gulp.js使用，运行时不需要)
│     ├─js.json (2个json文件仅供gulp.js使用，运行时不需要)
│     └─loader.js


4. 布署路径示意：
  每个 APP 在服务器本地仅布署1个文件
    ( index.html ) --> 放自已的服务器
  其他静态文件可布署在 CDN 或 OSS存储服务器上
    ( loader.js和和其他一些js,css,img,fonts ) --> 放CDN或OSS

5. 为方便开发，APP中约定下述子目录相对固定，不能变化。
  assets/js 放*.js，是 loader.js 加载 js 的指定位置。
  assets/css 放*.css，是 loader.js 加载 css 的指定位置。
  assets/fonts 放字体文件，要保持和 /css 相对路径不能变。
  assets/img 放图片的位置。
  
  与assest同级的 appNameXXX 放 loader.js


三、APP 在本地布署内容：
  
  仅 index.html 这个小文件
  其内容通常是固定的很少改动的，放在自己的服务器上
    
  (1)
    index.html 定义全局变量 window.__assetsPath
    (在gulp构建时根据 gulpfile.app.js 添加至 index.html)

  (2)
    index.html 只负责加载远程的 loader.js 文件
    不加载实际功能的 js或css
    (规定路径位置：__assetsPath/../appName/loader.js)
    (appName由gulp根据 --app 参数确定)
    
    
四、APP 在 CDN 或 OSS 上 布署的内容：
  (1) loader.js的任务是要加载实际功能所有需要的css, js
    (要加载的 js 和 css 文件的实际文件名
    在gulp构建时写入loader.js)
  (2) css, js, img, font文件
    放在 window.__assetsPath 下
    这些文件要按 第【一】点规定的目录路径布署文件 

    
五、说明
  (1) 
  index.html 这个文件内容
  通常是固定的很少改动，不怕微信缓存
  
  (2)
  通过在loader.js后加 `?_=xxx` 动态更新文件
  可解决微信缓存不更新文件的问题。
  
  (3)
  其他构建的js, css文件名通过用 gulp-rev自动重命名，避免微信缓存旧文件。




*/


/**
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
 *  3, `dep_test` - 发布静态文件到 ali-oss
 *     详见 gulp task 对应代码处的说明。
 *     可用于测试，测试通过后也可以直接使得到正式的APP中
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


  /**
   * ES6 支持
   * 需安装：
     npm install --save-dev gulp-babel
     npm install --save-dev babel-preset-es2015
     npm install --save-dev babel-core
   *
   */
  babel = require("gulp-babel"),


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

  oss = require('gulp-alioss'),

  notify = require('gulp-notify'),
  //order = require('gulp-order'),
  debug = require('gulp-debug');



var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));

// =======================================================================
var app_name = args['app'];
if (!app_name) app_name = args['a'];
if (!app_name) app_name = 'steefac';

fs.stat("./app/app-" + app_name + ".define.js", function (err, stat) {
  if (err) {
    console.log("Err: Missing ./app/app-" + app_name + ".define.js");
    process.exit(1);
  }
});

var configObj = require('./gulpfile.app.js')(app_name);

// =======================================================================


/**
 *  s1: templatecache
 *  把模板文件打包成JS文件，放在TMP目录下
 *  并登记到 configObj.injects 中，后面可自动注入
 */
gulp.task('templatecache', function () {

  //登记到 configObj.injects 中，后面可自动注入
  configObj.injects.splice(configObj.injects.length - 3, 0, [configObj.path.tmp + '/' + configObj.tplJsName]);

  //console.log('tplModule=',configObj.tplModule);
  //把模板文件打包成JS文件，放在TMP目录下
  return gulp.src(configObj.tplHtml)
    //.pipe(order(['app/**.html'])) //无法排序，不修改每次重建结果也都不一样 :(
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
    .pipe(templateCache(configObj.tplJsName, { module: configObj.tplModule }))
    .pipe(gulp.dest(configObj.path.tmp));
});


/**
 *  s2: inject
 *  注入 APP 的 js 和 css
 *  这里也会注入 步骤s1 templatecache 生成的 模板 js 文件。
 */
gulp.task('inject', ['templatecache'], function () {
  var src = configObj.path.app + '/' + configObj.html_src;
  var streams = [];
  configObj.injects.forEach(function (v, k) {
    streams[k] = gulp.src(v, { read: false });
  })
  return gulp.src(src)
    .pipe(inject(streamSeries(streams), { relative: true }))
    .pipe(rename(configObj.html_debug))
    .pipe(gulp.dest(configObj.path.app))
});

/**
 *  s3: wiredep
 *  注入 bower components
 */
gulp.task('wiredep', ['inject'], function () {
  return gulp.src(configObj.path.app + '/' + configObj.html_debug)
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
gulp.task('html-useref', ['wiredep'], function () {

  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });

  return gulp.src(configObj.path.app + '/' + configObj.html_debug)
    .pipe(useref())
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true, removeComments: true })))


    /* ES6支持 */
    .pipe(gulpif(/4.*\.js/, babel({ presets: ['es2015'] })))
    .on('error', function (err) {
      console.log('babel 转换错误：', err);
      this.end();
    })

    .pipe(gulpif('*.js', uglify({ compress: { drop_console: true } })))
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulpif('*.html', rename(configObj.dist_html)))
    .pipe(debug({ title: 'userefFiles : ' }))
    .pipe(gulp.dest(configObj.path.dist_app))

    //.pipe(debug({title:'a1 -'})) 
    .pipe(flatten())

    .pipe(jsFilter)
    //.pipe(debug({title:'BBB1 -'})) 
    .pipe(filelist('js.json', { relative: true }))
    .pipe(jsFilter.restore)
    //.pipe(debug({title:'bbbbbbb1 @@'})) 


    .pipe(cssFilter)
    //.pipe(debug({title:'BBBBBBBBB2 -'})) 
    .pipe(filelist('css.json', { relative: true }))
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
gulp.task('build-loader_safe', ['html-useref'], build_loader);
gulp.task('build-loader', build_loader);
function build_loader() {
  var src = configObj.path.app + '/' + configObj.html_src;
  var loaderJs = configObj.path.app + '/' + 'loader.js';

  //------------------------------------------------
  //1, 把loader.js里的css,js文件列表替换掉，然后写入dist目录
  var allJs = require('./' + configObj.path.dist_app + '/js.json');
  var allCss = require('./' + configObj.path.dist_app + '/css.json');

  //获取真实的js,css文件名
  //确保加载顺序，库的文件名是1-xxx.js，项目的文件名是2-xxx.js
  allJs.sort();
  allCss.sort();
  allJs = JSON.stringify(allJs);
  allCss = JSON.stringify(allCss);

  gulp.src(loaderJs)
    //替换 真实的js,css文件名
    .pipe(replace(
      "(document,__allJs__,__allCss__,__buildTime__)",
      "(document," + allJs + "," + allCss + ",'" + (new Date).toLocaleString() + "')"))
    .pipe(uglify({ compress: { drop_console: true } }))
    .pipe(gulp.dest(configObj.path.dist_app))


  // 生成多个版本的 loader
  var vers = {
    "cmoss.master.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_master_token__',
        apiRoot: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.1/src/cmoss/',
        apiRootUnit: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.1/src/api-unit/'
      };`,
    "cmoss.xcx.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_xcx_token__',
        apiRoot: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.1/src/cmoss/',
        apiRootUnit: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.1/src/api-unit/'
      };`,
    "cmoss.preview.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_preview_token__',
        apiRoot: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.2/src/cmoss/',
        apiRootUnit: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.2/src/api-unit/'
      };`,
    "cmoss.newest.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_preview_token__',
        apiRoot: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.3/src/cmoss/',
        apiRootUnit: 'https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.3/src/api-unit/'
      };`,
    "cmoss.test.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_test_token__',
        apiRoot: 'https://api.jdyhy.com/cmoss-test-1.0/src/cmoss/',
        apiRootUnit: 'https://api.jdyhy.com/cmoss-test-1.0/src/api-unit/'
      };`,
    "debug.loader": `
      window.__assetsPath = "../dist/assets";
      window.theSiteConfig = {
      };`
  };

  for (var name in vers) {
    gulp.src(loaderJs)
      .pipe(replace(
        "//window.theSiteConfig", vers[name]))
      //替换 真实的js,css文件名
      .pipe(replace(
        "(document,__allJs__,__allCss__,__buildTime__)",
        "(document," + allJs + "," + allCss + ",'" + (new Date).toLocaleString() + "')"))
      .pipe(uglify({ compress: { drop_console: false } }))
      .pipe(concat(name + ".js"))
      .pipe(gulp.dest(configObj.path.dist_root + '/loaders'))
  }




  //------------------------------------------------
  //2, app-b.html 文件只注入loader()函数，
  //   然后写入dist/imdex.html
  //
  // (注，app-b.html注入全部js,css后，
  //   是app/index.html
  //   用于调试。
  // app/index.html用usref合并压缩后，
  //   是写入dist/imdex0.html，属于备用文件)
  var depAss = configObj.path.assets_dep_at;

  var loader = function () {
    return function (ass, app) {
      window.__assetsPath = ass;
      var el = document.createElement("script")
      el.setAttribute("type", "text/javascript")
      el.setAttribute("src", ass + '/../' + app + '/loader.js?_' + (+new Date))
      document.getElementsByTagName("head")[0].appendChild(el)
    }
  }();

  var jsDep = "<script>(" +
    loader.toString() +
    ")('" + depAss + "','" + app_name + "')</script>";
  return gulp.src(src)
    .pipe(replace("</body>",
      jsDep + "</body>"))//在 index.html 最后添加<srcipt>

    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyJS: true }))
    .pipe(rename(configObj.dist_loader))
    .pipe(gulp.dest(configObj.path.dist_app))
}





gulp.task('copyImg', function () {
  return gulp.src(configObj.path.app_assets + '/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(configObj.path.dist_assets + '/img'))
});


//font-awesome 的字体文件
gulp.task('copyFonts1', function () {
  return gulp.src('bower_components/font-awesome/fonts/*.*')
    //.pipe(flatten())
    .pipe(gulp.dest(configObj.path.dist_assets + '/fonts'))
});


gulp.task('copy', ['copyFonts1', 'copyImg'], function () {

});;




//自动发布代码
/*
--------------------------------------------
./tmp/deploy.oss.js 文件内容
--------------------------------------------
module.exports = function () {
  return {
      accessKeyId: '******',
      secretAccessKey: '*********',
      endpoint: 'http://oss-cn-shanghai.aliyuncs.com',
      apiVersion: '2013-10-15',
      prefix: 'app-b', //for no prefix: prefix: ''
      bucket: 'qgs'
  };
}
--------------------------------------------
此任务发布5个文件到 ali-oss 

  /assets/css/1-xxx.css -> app-b/assets/css/1-xxx.css
  /assets/css/2-xxx.css -> app-b/assets/css/2-xxx.css
  /assets/js/3-xxx.js   -> app-b/assets/js/3-xxx.js  
  /assets/js/4-xxx.js   -> app-b/assets/js/4-xxx.js  
  /[APP_NAME]/loader.js   -> app-b/[APP_NAME]_test/loader.js  
--------------------------------------------
  莫名其妙的问题：
  1，在win下用oss上传文件，
  路径名 \xx\xx\xx.js，竟然都认作文件名了（确认有问题）
  2， 自动上传的文件和实际文件不一样？？（未确认）
*/
gulp.task('dep_test', function () {
  fs.stat('./tmp/deploy.oss.js', function (err, stat) {
    if (err == null) {
      var optionJs = require('./tmp/deploy.oss.js')();
      var optionCss = require('./tmp/deploy.oss.js')();
      var optionApp = require('./tmp/deploy.oss.js')();
      console.log('deploy TEST to ali-oss');
      var alljs = require('./' + configObj.path.dist_app + '/js.json');
      var allcss = require('./' + configObj.path.dist_app + '/css.json');

      var i;
      var depRt;
      var depFiles = [];

      var appb_root = 'app-b';

      optionJs.prefix = appb_root + '/assets/js/';
      depRt = configObj.path.dist_root + '/assets/js/';
      for (i = alljs.length; i--;) {
        depFiles.push(depRt + alljs[i]);
      }
      gulp.src(depFiles)
        .pipe(debug({ title: 'oss JS: ' }))
        .pipe(oss(optionJs));

      depFiles = [];
      optionCss.prefix = appb_root + '/assets/css/';
      depRt = configObj.path.dist_root + '/assets/css/';
      for (i = allcss.length; i--;) {
        depFiles.push(depRt + allcss[i]);
      }
      gulp.src(depFiles)
        .pipe(debug({ title: 'oss CSS: ' }))
        .pipe(oss(optionCss));

      optionApp.prefix = appb_root + '/' + app_name + '_test/';
      depRt = configObj.path.dist_root + '/' + app_name + '/loader.js';

      return gulp.src(depRt)
        .pipe(debug({ title: 'oss App: ' }))
        .pipe(oss(optionApp));

    } else {
      console.log('dep1 file error: ', err.code);
    }
  })
})

function clearTplFile() {
  fs.writeFile(configObj.path.tmp + '/' + configObj.tplJsName, '//clear after build');
};

gulp.task('build', ['bu', 'copy']);
gulp.task('bu', ['build-loader_safe'], clearTplFile);
gulp.task('dev', ['wiredep'], clearTplFile);
gulp.task('debug', ['wiredep']);
gulp.task('de', ['debug']);

gulp.task('default', ['dev']);
