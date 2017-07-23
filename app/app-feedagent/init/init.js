'use strict';
(function(){

angular.module('feedagent')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/init', {
    template: 'Please wait for init...<p ng-if="err">Error when init or login.</p>',
    controller: ['$scope','$http','$log','$location','AppbFeedService','AppbData','AppbUiService',
      function ($scope,$http,$log,$location,AppbFeedService,AppbData,AppbUiService) {
        var userData=AppbData.getUserData();
        var appData=AppbData.getAppData();
        var feedData=appData.feedData;
        
        var srh=$location.search(  );
        var token=srh.token;
        var uid=srh.uid;
        
        if(!token|| !uid){
          return $scope.err=true;
        }
        if(token==userData.token) {
          return $location.path('/explore').search({});
        }
        
        appData.setUserData({});
        var api=appData.urlApi('feed','test');
        $http.jsonp(api, {params:{token:token,uid:uid}})
        .then(function(s){
          if(s.data.errcode!=0) {
            return $scope.err=true;
          }
          appData.setUserData({init:1,token:token,uid:uid});
          return $location.path('/explore').search({});
        },function(e){
          return $scope.err=true;
        })
      }
    ]
  })
}]);

//___________________________________
})();
