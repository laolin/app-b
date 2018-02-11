'use strict';
(function(){

angular.module('steefac',[
  'amap-main',
  'ksSwiper',
  'app-config',
  'app-run',
  'ngRoute'
])
.run(['$log','AppbData',function($log,AppbData){
  AppbData.activeHeader('home', ''); 
  AppbData.activeFooter('index');
}])


//___________________________________
})();
