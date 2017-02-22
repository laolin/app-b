'use strict';
(function(){


// Declare app level module which depends on views, and components
angular.module('appb', [
    
    'ngResource',
    'ngRoute'
  ]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);

//___________________________________
})();
