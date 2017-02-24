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
      }
    ]
  })
}]);

//___________________________________
})();
