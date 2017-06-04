/*
  (1) index.html 文件其实内容基本是固定的， 除了加载的CSS、JS文件变化。
  (2) 所以使用此js来替代index.html中加载的文件，相应地从index.html中删掉 css , js 引用。
  (3) 要加载的CSS，JS文件名列表是通过 
      getJson( 'css.json' )和getJson( 'js.json' ) 动态获取的，
      css.json 和 js.json 通过 `gulp-filelist` 插件自动生成。
  (4) 再根据得到的文件名列表，通过 loadFile() 加载真正的js,css文件。
  
  (5) 这个文件的效果是由于本文件的内容通常是固定的很少改动，不怕微信缓存
    第(3)步中通过在json文件名后加 `?_=xxx` 能动态更新文件
    可解决微信缓存不更新文件的问题。
*/
(function (document){
  function getJson(url){
      var Httpreq = new XMLHttpRequest(); // a new request
      Httpreq.open("GET",url,false);
      Httpreq.send(null);
      return JSON.parse(Httpreq.responseText);          
  }
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

  // `__assetsPath`  在 assetsPath.config.js 里定义
  // gulp构建时会根据gulp.app-xxx.js的配置修改值
  function loadAllJs(js,i) {
    if(i>=js.length)return;
    loadFile(__assetsPath+'/'+js[i],'js',function(){loadAllJs(js,i+1)});
  }
  function loadAllCss(css) {
    for(var i=0;i<css.length;i++) {
      loadFile(__assetsPath+'/css/'+css[i],'css');
    }
  }
  var allCss= getJson( 'css.json' + "?_=" + (+new Date()) );
  var allJs = getJson(  'js.json' + "?_=" + (+new Date()) );
  window.__assetsPath='../assets';
  allCss.sort();
  allJs.sort();
  loadAllCss(allCss);
  loadAllJs(allJs,0);
})(document);
