/*
加载器
*/
(function (document, json, buildTime) {
  window.__window_config___
  console.log('加载器');

  //window.__assetsPath 在 index.html 中定义
  var __assetsPath = window.__assetsPath || '../assets';
  window.__buildTime = buildTime;

  loadCSs(0);
  loadJs(0);

  var head = document.getElementsByTagName("head")[0];

  function loadCSs(nth) {
    nth = nth || 0;
    if (nth >= json.length) return;
    var filename = __assetsPath + '/output/' + json[nth];
    if (/\.css$/i.test(filename)) {
      var css = document.createElement("link");
      css.setAttribute("rel", "stylesheet");
      css.setAttribute("type", "text/css");
      css.setAttribute("href", filename);
      document.head.appendChild(css);
    }
    loadCSs(nth + 1);
  }
  function loadJs(nth) {
    nth = nth || 0;
    if (nth >= json.length) return;
    var filename = __assetsPath + '/output/' + json[nth];
    if (/\.js$/i.test(filename)) {
      var script = document.createElement('script')
      script.setAttribute("type", "text/javascript")
      script.setAttribute("src", filename)
      document.head.appendChild(script)
      script.onload = function () {
        loadJs(nth + 1);
      }
    }
    else {
      loadJs(nth + 1);
    }
  }



})(document, __allJson__, __buildTime__);
  // gulp构建时会根据构建结果文件名修改上行真正的值
  // 故上面括号里的任何字符不可以修改，否则会替换失效。
