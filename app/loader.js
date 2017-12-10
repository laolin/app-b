/*
一、APP文件组成 及 布署路径示意：

(1)通过gulp自动构建的APP页面由：
  一个index.html
  一个loader.js
  和其他一些js,css,img,fonts组成。
  
(2)自动构建生成的APP文件路径示意：
  
├─APP_DEPLOY_ROOT
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
│  │  └─loader.js
│  ├─appName2
│  │  ├─index.html (此文件要布署在本地服务器)
│  │  └─loader.js
│  └─appNameN
│     ├─index.html (此文件要布署在本地服务器)
│     └─loader.js


(3)布署路径示意：
  每个 APP 在服务器本地仅布署1个文件
    ( index.html ) --> 放自已的服务器
  其他静态文件可布署在 CDN 或 OSS存储服务器上
    ( loader.js和和其他一些js,css,img,fonts ) --> 放CDN或OSS

(4)为方便开发，APP中约定下述子目录相对固定，不能变化。
  assets/js 放*.js，是 loader.js 加载 js 的指定位置。
  assets/css 放*.css，是 loader.js 加载 css 的指定位置。
  assets/fonts 放字体文件，要保持和 /css 相对路径不能变。
  assets/img 放图片的位置。
  
  与assest同级的 appNameXXX 放 loader.js


  二、APP 在本地布署内容：
  
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
    
    
二、APP 在 CDN 或 OSS 上 布署的内容：
  (1) loader.js的任务是要加载实际功能所有需要的css, js
    (要加载的 js 和 css 文件的实际文件名
    在gulp构建时写入loader.js)
  (2) css, js, img, font文件
    放在 window.__assetsPath 下
    这些文件要按 第【一】点规定的目录路径布署文件 

    
三、说明
  (1) 
  index.html 这个文件内容
  通常是固定的很少改动，不怕微信缓存
  
  (2)
  通过在loader.js后加 `?_=xxx` 动态更新文件
  可解决微信缓存不更新文件的问题。
  
  (3)
  其他构建的js, css文件名通过用 gulp-rev自动重命名，避免微信缓存旧文件。


*/
(function (document){


  //window.__assetsPath 在 index.html 中定义
  var __assetsPath=window.__assetsPath||'../assets'; 
  // gulp构建时会根据构建结果文件名修改下2行真正的值
  var allJs=[];/*!!__ALLJS__!!*/
  var allCss=[];/*!!__ALLCSS__!!*/
  //上面这一行在gulp构建APP时会被自动替换掉。
  //不能随便加空格，否则可能替换失败。
  
  //allCss.sort();
  loadAllCss(allCss);
  
  //allJs.sort();
  loadAllJs(allJs,0);



  /*function getJson(url){
      var Httpreq = new XMLHttpRequest(); // a new request
      Httpreq.open("GET",url,false);
      Httpreq.send(null);
      return JSON.parse(Httpreq.responseText);          
  }*/
  function loadFile(filename, filetype,callback){
    //console.log('Loading......',filename);
    var fileref;
    if (filetype=="js"){ //if filename is a external JavaScript file
      fileref=document.createElement('script')
      fileref.setAttribute("type","text/javascript")
      fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
      fileref=document.createElement("link");
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined") {
      document.getElementsByTagName("head")[0].appendChild(fileref)
      fileref.onload=function() {
        //console.log('----DONE----',filename);
        if(callback)callback();
      }
    }
  }

  function loadAllJs(js,i) {
    if(i>=js.length)return;
    loadFile(__assetsPath+'/js/'+js[i],'js',function(){loadAllJs(js,i+1)});
  }
  function loadAllCss(css) {
    for(var i=0;i<css.length;i++) {
      loadFile(__assetsPath+'/css/'+css[i],'css');
    }
  }
  
})(document);
