/*
说明见 gulp.js 
*/
(function (document,allJs,allCss,buildTime){

  //window.theSiteConfig //将在loader构建时，自动加入

  //window.__assetsPath 在 index.html 中定义
  var __assetsPath=window.__assetsPath||'../assets'; 
  window.__buildTime=buildTime; 
  
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
  
})(document,__allJs__,__allCss__,__buildTime__);
  // gulp构建时会根据构建结果文件名修改上行真正的值
  // 故上面括号里的任何字符不可以修改，否则会替换失效。
