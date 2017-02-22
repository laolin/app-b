'use strict';
(function(){

angular.module('view-default')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/default-search', {
    templateUrl: 'views/default/default-search.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        
      }
    ]
  })
}]);

//___________________________________
})();
