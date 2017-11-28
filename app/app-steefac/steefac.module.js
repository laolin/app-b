'use strict';
(function(){

angular.module('steefac',[
  'amap-main',
  'ksSwiper',
  'ngRoute'
])
.run(['$log','AppbData',function($log,AppbData){
  AppbData.activeHeader('home', ''); 
  AppbData.activeFooter('index');
}])


//___________________________________
})();
