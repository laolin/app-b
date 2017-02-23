'use strict';
(function(){

angular.module('view-default')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/default-settings', {
    templateUrl: 'view-default/default/default-settings.template.html',
    controller: ['$scope','$location','$log','$interval','AppbData',
      function ($scope,$location,$log,$interval,AppbData) {
        
        var lastHeader = AppbData.getHeaderData();
        var lastname=lastHeader.name;
        var lasttitle=lastHeader.title;
        AppbData.activeHeader('_R','测试');
        $scope.$on('$destroy',function (){
          AppbData.activeHeader(lastname,lasttitle);
        })
      }
    ]
  })
}]);

//___________________________________
})();
