'use strict';

module.exports = function(app_name) { return {
  "html_src": "app-b.html", 
  "html_debug": "index.html", //这是app目录下的文件名，用于调试
  
  "dist_loader": "index.html", // 只注入 loader 后做 index.html
  "dist_html": "index0.html", // 注入一大堆js,css的 不做index.html,改名做 index0.html
  
  "path": {
    "app": "app",    
    "app_assets": "assets",  
    
    "dist_root": "dist",
    "dist_assets": "dist/assets",
    "dist_app": "dist/"+app_name,
    
    "tmp": "tmp",
    
    // assets_dep_at 是运行时的路径（相对于index.html的路径）
    // 注assets可部署在本地，也可跨域部署在独立的机器上(需要配置字体跨域支持)
    "assets_dep_at":"../assets" //部署在本地
    //"assets_dep_at":"https://app.linjp.cn/static/assets-b" //部署在独立的机器上
  },
  
  //【template 模板 处理】 ---------------------------- 
  "tplModule": "appb",
  
  // /app/后马上跟两个*号，否则路径的 base 不对，模板不能用
  "tplHtml": [
    "./app/**/modules/**/*.template.html",
    "./app/**/app-"+app_name+"/**/*.template.html"
  ],
    
  "tplJsName": "tpl_"+app_name+".js",
  
  // 【injects 注入内容】 ---------------------------- 
  //  注：
  // 第一维下标是能保持注入顺序的， 
  // 但第二维数组内部各文件的注入顺序是不保证和下标一致的",

  "injects": [
    [
      "./app/app-"+app_name+".define.js"
    ], 
    [
      "./app/modules/**/*.module.js"
    ], 
    [
       "./app/modules/**/*.js",
      "!./app/modules/**/*.module.js"
    ], 
    [
      "./app/app-"+app_name+"/**/*.module.js"
    ], 
    [
       "./app/app-"+app_name+"/**/*.js",
      "!./app/app-"+app_name+"/**/*.module.js"
    ], 
    [
      "./app/modules/**/*.css"
    ], 
    [
      "./app/app-"+app_name+"/**/*.css"
    ]
  ]
}}