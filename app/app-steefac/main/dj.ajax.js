!(function (angular, window, undefined) {
  /**
   * 加载 angular 之前的 ajax 功能函数
   */
  angular.extend(angular.dj || (angular.dj = {}), (function(){
    /**
     * 最简单的ajax
     */
    function get(url, success) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
          success(xhr.responseText);
        }
      }
      xhr.open("GET", url, true);
      xhr.send(null);
    };
    function getJson(url, success) {
      get(url, function (responseText) {
        success(JSON.parse(responseText));
      })
    }
    return {
      isWx: (/micromessenger/i).test(navigator.userAgent),
  
      get: get,
      getJson: getJson,
    };
  })());


})(angular, window);
