'use strict';
(function(){

angular.module('appb')
.factory('AppbDataHeader',
['$route','$rootScope','$location','$log',
function($route, $rootScope,$location,$log) {

  var headerData={};
  
  // headerData
  headerData.headerText='Welcome!';
  
  // 链接需要正常的html的地址格式，就是要写上 #!，因为链接可能是外部链接
  headerData.widgets=[
    {side:'left',link:'#!/test',icon:'cubes'},
    {side:'left',link:'#!/',text:'HOME'},
    //{side:'left',link:'javascript:;',img:'assets/img/logo-32.png',text:''},
    {side:'right',link:'#!/power',icon:'battery-half'},
    {side:'right',link:'#!/default-settings',text:'测试中'}
  ];
  return {    
    getHeaderData:function(){return headerData}
  }
  
}]);
 
  
//___________________________________
})();
