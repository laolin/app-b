'use strict';
(function(){
var MARK_API_CALLBACK='cb_xd';//和后端API的约定字符串

angular.module('wx-login')
.component('wxLoginCallback',{
  template:' = wx-LoginCallback ',//回调页面不需要显示内容
  bindings: {
    appData: '='
  },
  controller: ['$scope','$log','$location','$http',
    function($scope,$log,$location,$http) {
      this.$onInit= function() {
        var srh=$location.search();
        var pageTo=srh.pageTo;
        if(!pageTo)pageTo='/';

        var url=appData.appCfg.apiWxAuth+"/bindwx/callback_auth?code="
          +srh._ret_code+'&app='+srh._ret_app+'&clientid='+appData.clientId;
        $http.jsonp(url).then(function(data) {
          if(data.data.errcode!=0) {
            $log.log('Recall Error!',data.data.errcode,data.data.msg);
            $location.path( pageTo );
          } else {
            $log.log('Recall OK!',data.data.data);
            appData.setUserData(data.data.data);
            $location.path( pageTo ).search({});
          }
        });
      }
    }
  ]   
});

//________________________
})();
