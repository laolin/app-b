/**
 * 公司详情页面
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/hash-page/:hash', {
      template: '',
      controller: ['$scope', '$routeParams', '$location', 'SIGN', ctrl]
    });
  }]);

  function ctrl($scope, $routeParams, $location, SIGN) {
    var hash = $routeParams.hash;
    SIGN.post('stee_data', 'hash', {hash})
    .then(json =>{
      var path = '#!' + json.datas.path;
      console.log('hash, path = ', path);
      $location.path(json.datas.path).search(json.datas.search||{});
    })
    .catch( (e) =>{
      $location.path( "/search" ).search({});
    })
    $scope.$on('$routeChangeStart', function(evt, next, current) {
      console.log('hash 页面 routeChangeStart');
    });
  }
})(window, angular);