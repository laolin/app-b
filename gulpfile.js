
var args = require('minimist')(process.argv.slice(2));
var app_name = 'qgs';
var srcPath = 'src';
var distPath = 'dist';
var SERVET_ROOT = 'https://api.qinggaoshou.com/api-qgs-vers';
var VER = '2.0.0';

var configs = {
  "srcPath": srcPath,
  "distPath": distPath,
  "tmpPath": distPath + "/tmp",
  "jsonPath": distPath + "/json",
  "outputPath": distPath + "/output",
  "baseHtmlName": "base.html",
  "distHtmlName": "index.dist.html",
  "templateJsName": "template.js",
  "injects": [
    [
      srcPath + "/app/**/*.css"
    ],
    [
      srcPath + "/app/**/*.config.js"
    ],
    [
      srcPath + "/app/**/*.define1.js"
    ],
    [
      srcPath + "/app/**/*.define.js"
    ],
    [
      srcPath + "/app/lib/*.js"
    ],
    [
      srcPath + "/app/**/*.module.js"
    ],
    [
      srcPath + "/app/**/*.js",
      "!" + srcPath + "/app/**/*.config.js",
      "!" + srcPath + "/app/**/*.define1.js",
      "!" + srcPath + "/app/**/*.define.js",
      "!" + srcPath + "/app/**/main.js",
      "!" + srcPath + "/app/**/*.module.js"
    ],
    [
      srcPath + "/app/**/main.js"
    ]
  ],

  loaderPath: distPath + "/loader",
  loaderList: {
    "master.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_master_token__',
        apiRoot_old: '${SERVET_ROOT}/${VER}/src/api-old',
        apiRoot: '${SERVET_ROOT}/${VER}/src/${app_name}',
        title:{
          hide   : true,
          text   : '正式版'
        }
      };`,
    "preview.loader": `
      window.__assetsPath = "https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets";
      window.theSiteConfig = {
        localStorage_Token_KEY: '__cmoss_preview_token__',
        apiRoot_old: '${SERVET_ROOT}/${VER}/src/api-old',
        apiRoot: '${SERVET_ROOT}/${VER}/src/${app_name}',
        title:{
          hide   : true,
          text   : '预览版'
        }
      };`,
    "local.loader": `
      window.__assetsPath = "../dist";
      window.theSiteConfig = {
        apiRoot: '../../../api-${app_name}/src/${app_name}',
        title:{
          hide   : true,
          text   : '本地版本'
        }
      };`,
  }
};

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
var path = require('path');
var args = require('minimist')(process.argv.slice(2));


function readJson(fn, callback) {
  var file1 = path.resolve(fn);
  fs.exists(file1, function (exists) {
    if (exists) {
      var json = require('./' + fn);
      callback(json);
    } else {
      callback(false);
    }
  });
}


/**
 *  s1: templatecache
 *  把模板文件打包成JS文件，放在TMP目录下
 *  并登记到 configObj.injects 中，后面可自动注入
 */
gulp.task('templatecache', function () {

  //登记到 configObj.injects 中，后面可自动注入
  //configs.injects.push([configs.tmpPath + '/' + configs.templateJsName]);

  //把模板文件打包成JS文件，放在TMP目录下
  return gulp.src([configs.srcPath + "/app/**/*.html"])
    //.pipe(order(['app/**.html'])) //无法排序，不修改每次重建结果也都不一样 :(
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    //指定templatecache生成的目录、文件名，以便合并到 useref 指定的js文件中
    .pipe(templateCache(configs.templateJsName, {
      root: 'app/',
      module: 'dj-app'
    }))
    .pipe(gulp.dest(configs.tmpPath));
});


/**
 *  s2: inject
 *  注入 APP 的 js 和 css
 *  这里也会注入 步骤s1 templatecache 生成的 模板 js 文件。
 */
gulp.task('inject', ['templatecache'], function () {
  var streams = [];
  configs.injects.forEach(function (v, k) {
    streams[k] = gulp.src(v, { read: false });
  });
  /* 调试用主页 */
  gulp.src(configs.srcPath + '/' + configs.baseHtmlName)
    .pipe(inject(streamSeries(streams), { relative: true }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(configs.srcPath));

  /* 发布页面的临时文件，用于 bower 注入 */
  //console.log(configs.tmpPath + '/' + configs.templateJsName);
  streams.splice(streams.length - 1, 0, gulp.src(configs.tmpPath + '/' + configs.templateJsName, { read: false }));

  return gulp.src(configs.srcPath + '/' + configs.baseHtmlName)
    .pipe(inject(streamSeries(streams), { relative: true }))
    .pipe(rename(configs.distHtmlName))
    .pipe(gulp.dest(configs.srcPath))
});

/**
 *  s3: wiredep
 *  注入 bower components
 */
gulp.task('wiredep', ['inject'], function () {
  return gulp.src([
    configs.srcPath + '/index.html',
    configs.srcPath + '/' + configs.distHtmlName
  ])
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    //.pipe(rename(configObj.html_debug))
    .pipe(gulp.dest(configs.srcPath))
});

/**
 *  s4: html-useref
 *  把 css js 合并
 *
 *  同时生成 css.json js.json 文件到 jsonPath 目录下，供loader.js使用
 */
gulp.task('html-useref', ['wiredep'], function () {
  var old_files = [];
  try {
    fs.readdirSync(configs.outputPath)
      .filter(function (filename) {
        old_files.push(filename);
      });
    //console.log('已有旧的输出文件', configs.outputPath);
  }
  catch (err) {
    console.log('是第一次构建吧');
  };
  var old_files_not = old_files.filter(fn => fn != 'index.html').map(fn => '!**/' + fn);
  old_files_not.unshift('**');
  var withoutOldFilter = filter(old_files_not, { restore: true });


  var jsonFilter = filter(["**/*.js", "**/*.css"], { restore: true });

  return gulp.src(configs.srcPath + '/' + configs.distHtmlName)
    .pipe(useref())
    .pipe(gulpif('*.css', cleanCSS()))
    //.pipe(gulpif('*.html', htmlmin({collapseWhitespace: true,removeComments: true})))

    /* ES6支持 */
    .pipe(gulpif(/app.*\.js/, babel({ presets: ['es2015'] })))
    .on('error', function (err) {
      console.log('babel 转换错误：', err);
      this.end();
    })

    .pipe(gulpif('*.js', uglify({ compress: { drop_console: false } })))
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulpif('*.html', rename('index.html')))
    //.pipe(debug({ title: '有效的输出文件: ' }))

    .pipe(withoutOldFilter)
    //.pipe(debug({ title: '新输出: ' }))
    .pipe(gulp.dest(configs.outputPath))

    .pipe(withoutOldFilter.restore)
    .pipe(flatten())
    //.pipe(debug({ title: '有效的输出文件: ' }))
    .pipe(filelist('new_files.json', { relative: true }))
    .pipe(gulp.dest(configs.jsonPath))

    .pipe(withoutOldFilter.restore)
    .pipe(jsonFilter)
    //.pipe(debug({ title: '用于 loader: ' }))
    .pipe(filelist('all.json', { relative: true }))
    .pipe(gulp.dest(configs.jsonPath))

});


/**
 * font-awesome 的字体文件
 */
gulp.task('font-awesome', function () {
  return gulp.src('bower_components/font-awesome/fonts/*.*')
    .pipe(gulp.dest(configs.distPath + '/fonts'))
});
/**
 * font-awesome 的字体文件
 */
gulp.task('bootstrap-font', function () {
  return gulp.src('bower_components/bootstrap/fonts/*.*')
    .pipe(gulp.dest(configs.distPath + '/fonts'))
});


function build_loader() {
  try {
    readJson(configs.jsonPath + "/all.json", json => {
      build_loader_json(json || [])
    });
  }
  catch (err) {
    console.log('首次构建，不生成 loader...', err);
  };
}
function build_loader_json(json) {
  var loaderJs = configs.srcPath + '/loader.js';
  json.sort((a, b) => a > b ? -1 : 1); // 只有 lib- 和 app- 开头的，所以可以逆排序
  gulp.src(loaderJs)
    //替换 真实的js,css文件名
    .pipe(replace(
      "(document, __allJson__, __buildTime__)",
      "(document," + JSON.stringify(json) + ",'" + (new Date).toLocaleString() + "')"))
    .pipe(uglify({ compress: { drop_console: false } }))
    .pipe(gulp.dest(configs.jsonPath))
  for (var name in configs.loaderList) {
    gulp.src(loaderJs)
      //替换 真实的js,css文件名
      .pipe(replace(
        "window.__window_config___", configs.loaderList[name]))
      .pipe(replace(
        "(document, __allJson__, __buildTime__)",
        "(document," + JSON.stringify(json) + ",'" + (new Date).toLocaleString() + "')"))
      .pipe(uglify({ compress: { drop_console: false } }))
      .pipe(concat(name + ".js"))
      .pipe(gulp.dest(configs.loaderPath))
  }
}




function clean_output(showLog) {
  readJson(configs.jsonPath + "/new_files.json", data => {
    var new_files = data || [];
    var all_files = [];
    try {
      fs.readdirSync(configs.outputPath)
        .filter(function (filename) {
          all_files.push(filename);
        });
    }
    catch (err) {
      console.log('怎么可能没有文件！');
    };
    var toDelete = all_files.filter(fn => !new_files.find(fnNew => fnNew == fn));
    if (toDelete.length) console.log("清除旧输出：", toDelete);
    toDelete.map(fn => {
      del([configs.outputPath + '/' + fn], { force: true });
    });
    showLog && log_dist();
  });
}
function clean_output_and_log() {
  clean_output(true);
}

/** 最终输出结果 */
function log_dist() {
  var new_files = [];
  readJson(configs.jsonPath + "/new_files.json", data => {
    var new_files = data || [];
    // 排序一下，好看些
    new_files = new_files.sort((a, b) => {
      if (a == 'index.html') return -1;
      if (b == 'index.html') return 1;
      return a > b ? -1 : 1;
    })

    var names = [];
    for (var name in configs.loaderList) {
      names.push(name);
    }
    console.log("\n\n输出：\n\n ┬┬ " + configs.loaderPath + '/');
    for (var i = 0; i < names.length; i++) {
      if (names.length - i > 1)
        console.log(" │├─  " + names[i] + ".js");
      else
        console.log(" │└─  " + names[i] + ".js");
    }
    console.log(" │");
    console.log(" └┬ " + configs.outputPath + '/');
    for (var i = 0; i < new_files.length; i++) {
      if (new_files.length - i > 1)
        console.log("   ├─  " + new_files[i] + ".js");
      else
        console.log("   └─  " + new_files[i] + ".js");
    }
    //console.log("   ├─  " + new_files.join("\n   ├─  "));
  });
}


/**
 * 测试
 */
gulp.task('test', function () {
  console.log("\n\n输出：\n\n ├┬ " + configs.outputPath);
  //console.log("    |");
  console.log("   ├─  abc.js");
  console.log("   ├─  abc.js");
  console.log("   ├─  abc.js");
  console.log("   └─  abc.js");
  console.log("\n");
});


gulp.task('build_AND_loader', ['html-useref', 'font-awesome', 'bootstrap-font'], build_loader);
gulp.task('build', ['wiredep'], build_loader);
gulp.task('bu', ['html-useref', 'loader']);
gulp.task('clean', ['build_AND_loader'], clean_output_and_log);
gulp.task('default', ['build_AND_loader'], log_dist);
