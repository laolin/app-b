!(function (angular, window, undefined) {

  var theApp = angular.module('dj-app', [
    'ngFileUpload',
    'dj-view',
    'dj-service',
    'dj-component',
    'dj-form',
    'dj-filter'
  ])


  theApp.config(['$sceDelegateProvider', '$locationProvider',
    function ($sceDelegateProvider, $locationProvider) {
      var oldList = $sceDelegateProvider.resourceUrlWhitelist();
      oldList.push(location.host);
      oldList.push(
        'https://api.esunion.com/**',
        'https://api.qingaoshou.com/**',
        'https://api.jdyhy.com/**',
        'https://esunion.com/**',
        'https://jdyhy.com/**',
        'self'
      );
      $sceDelegateProvider.resourceUrlWhitelist(oldList);
      $locationProvider.hashPrefix('');
      //$locationProvider.html5Mode(true);
    }
  ])


})(angular, window);
