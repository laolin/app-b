(function () {

  angular.module('steefac', [
    'amap-main',
    'ksSwiper',
    'app-config',
    'app-run',
    'dj-view',
    'dj-component',
    'ngRoute'
  ])
    .run(['$log', 'AppbData', function ($log, AppbData) {
      AppbData.activeHeader('home', '');
      AppbData.activeFooter('index');
    }])


    /** 一些常用的注入 */
    .factory("APP", ['$http', "$q", "$timeout", "$location", "UserToken", "SiteConfig", "DjDialog",
      function ($http, $q, $timeout, $location, UserToken, SiteConfig, DjDialog) {
        return {
          $http, $q, $timeout, $location,
          UserToken, SiteConfig, DjDialog,
        }
      }
    ])


  //___________________________________
})();
