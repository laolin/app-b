'use strict';
(function(){

//和后端API的约定字符串
var MARK_API_CALLBACK=appbCfg.markWxLoginCallback;

angular.module('wx-login')
.component('wxLoginCallback',{
  template:' ',//回调页面不需要显示内容
  bindings: {
    appData: '='
  },
  controller: ['$scope','$log','$location','$http',
    function($scope,$log,$location,$http) {
      this.$onInit= function() {
        var srh=$location.search();
        var pageTo=srh.pageTo;
        if(!pageTo)pageTo='/';

        $http.post('/app/wx_code_login',{
          name: srh._ret_app,
          code: srh._ret_code
        },{
          signType: 'single'
        }).then(json => {
          console.log('静态api, OK', json);
          angular.dj.userToken.save(json.datas);
          console.log('即将跳转：', pageTo);
          location.hash = '#!' + pageTo;
          //$location.path( pageTo ).search({});
        }).catch(json =>{
          console.log('静态api, 拒绝', json);
        });

        return;

        var url=appData.appCfg.apiWxAuth+"/bindwx/callback_auth?code="
          +srh._ret_code+'&app='+srh._ret_app+'&clientid='+appData.clientId;

        $http.jsonp(url).then(function(data) {
          if(data.data.errcode!=0) {
            $log.log('Recall Error!',data.data.errcode,data.data.msg);
            //$location.path( pageTo );
            return appData.dialogData.msgBox(data.data.msg,'登录出错');
          } else {
            if(!data.data.data.token)
              return appData.dialogData.msgBox(JSON.stringify(data.data.data),'数据出错');
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
