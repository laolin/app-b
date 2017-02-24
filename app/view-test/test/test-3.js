'use strict';
(function(){

angular.module('view-test')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test-3', {
    templateUrl: 'view-test/test/test-3.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        
        AppbData.setHeader('TEST-3 3 3','Browser Title',-1,
          [
            {side:'left',link:'/test-1',icon:'cubes'},
            {side:'right',link:'/',absUrl:1,icon:'battery-half'},
            {side:'right',link:'/test-2',text:'test2'},
            {side:'right',link:'/',text:'home'}
          ]
        );
        //一般要放在只会初始化一次的地方
        AppbData.addFooter('ALL hehe',[
          {text:'首页',icon:'home',href:'/',onClick:0,active:0},
          {text:'搜索',icon:'search',href:'/default-search',onClick:0,active:1},
          {text:'测试',icon:'cog',href:'/default-settings',onClick:0,active:0},
          {text:'TEST1',icon:'bath',href:'/test-1',onClick:0,active:0},
          {text:'test2',icon:'bell',href:'/test-2',onClick:0,active:2},
          {text:'test-3',icon:'bicycle',href:'/test-3',onClick:0,active:0}
        ],1);
        
      }
    ]
  })
}]);

//___________________________________
})();
