'use strict';

module.exports = 
{
  "html_src": "app-b.html", 
  "html_loader": "app-b.loader.html", 
  "html_debug": "index.html", 
  "html_dist": "index0.html", // html_loader 改名后做 index.html
  
  "path": {
    "app": "app",    
    "tmp": "tmp",
    "dist": "dist-jia"
  },
  
  //【template 模板 处理】 ---------------------------- 
  "tplModule": "appb",
  
  // /app/后马上跟两个*号，否则路径的 base 不对，模板不能用
  "tplHtml": [
    "./app/**/modules/**/*.template.html",
    "./app/**/app-jia/**/*.template.html"
  ],
    
  "tplJsName": "tpl_jia.js",
  
  // 【injects 注入内容】 ---------------------------- 
  //  注：
  // 第一维下标是能保持注入顺序的， 
  // 但第二维数组内部各文件的注入顺序是不保证和下标一致的",

  "injects": [
    [
      "./app/app-jia/app-jia.define.js"
    ], [
      "./app/**/modules/**/*.module.js",
      "!./app/bower_components/**/*"
    ], [
      "./app/**/modules/**/*.js",
      "!./app/**/*.module.js", 
      "!./app/bower_components/**/*"
    ], [
      "./app/**/app-jia/**/*.module.js",
      "!./app/bower_components/**/*"
    ], [
      "./app/**/app-jia/**/*.js",
      "!./app/app-jia/app-jia.define.js",
      "!./app/**/*.module.js", 
      "!./app/bower_components/**/*"
    ], [
      "./app/assets/js/common.js",
      "./app/assets/css/**/*.css"
    ], [
      "./app/app-jia/**/*.css"
    ]
  ]
}
