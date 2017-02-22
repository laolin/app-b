'use strict';
(function(){

angular.module('view-default')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/default-settings', {
    templateUrl: 'views/default/default-settings.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        
      }
    ]
  })
}]);

//___________________________________
})();
