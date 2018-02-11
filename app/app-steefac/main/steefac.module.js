'use strict';
(function(){

angular.module('steefac',[
  'amap-main',
  'ksSwiper',
  'app-config',
  'ngRoute'
])
.run(['$log','AppbData',function($log,AppbData){
  AppbData.activeHeader('home', ''); 
  AppbData.activeFooter('index');
}])
.run(['$rootScope', '$location', 'FacUser', function($rootScope, $location, FacUser){
  /**
   * 路由监听，设置标题，设置微信分享
   */
  $rootScope.$on('$routeChangeSuccess', function(evt, current, prev) {
    let route = current.$$route;
    requireLogin(route);
  });

  function requireLogin(route){
    if(route.requireLogin == 'super-admin'){
      //console.log('请求超级管理员...');
      FacUser.getMyData()
      .then((user) => {
        if(!FacUser.isAdmin()){
          return $q.reject('不是超级管理员');
        }
        //console.log("请求超级管理员:成功！", user)
      })
      .catch( e => {
        //console.log("请求超级管理员:失败！", e)
        $location.path("/home").replace();
      })
    }
    else if(route.requireLogin){
      console.log('请求登录...');
      FacUser.getMyData(); // 这里有要求登录了
    }

  }
}])


//___________________________________
})();

