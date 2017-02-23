'use strict';
(function(){

angular.module('appb')
.factory('AppbDataFooter',
['$route','$rootScope','$location','$log',
function($route, $rootScope,$location,$log) {

  var footerData={};
    
  // footerData
  // footer 的链接强制是APP内部链接, 即链接要求是 #!/xxx ，
  // 但js中的链接不需要写全， 模板中会自动加 #!
  // '/' 实际代表 '#!/' ， '/default-search' 代表 '#!/default-search'。
  footerData.tabs=[
    {text:'首页',icon:'home',href:'/',onClick:0,active:0},
    {text:'搜索',icon:'search',href:'/default-search',onClick:0,active:1},
    {text:'测试',icon:'cog',href:'/default-settings',onClick:0,active:0}
  ];
  
  return {    
    getFooterData:function(){return footerData}
  }
  
}]);
 
  
//___________________________________
})();
