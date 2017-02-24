'use strict';
(function(){

angular.module('view-test')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test-2', {
    templateUrl: 'view-test/test/test-2.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        AppbData.setHeader('TEST-2 bB bB b');
        AppbData.activeFooter('test');
      }
    ]
  })
}]);

//___________________________________
})();
