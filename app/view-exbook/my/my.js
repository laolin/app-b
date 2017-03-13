'use strict';
(function(){

angular.module('exbook')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/my', {
    templateUrl: 'view-exbook/my/my.template.html',
    controller: ['$scope','$location','$log','ExbookService','AppbData','AppbUiService',
      function ($scope,$location,$log,ExbookService,AppbData,AppbUiService) {

      }
    ]
  })
}]);

//___________________________________
})();
