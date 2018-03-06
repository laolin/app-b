/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('facDetailMini', function(){
    return {
      restrict: 'AE',
      templateUrl: 'app-steefac/component/fac-detail/fac-detail-mini.template.html',
      scope: {
        fac: "="
      },
      controller: ['$scope', '$element', '$location', 'FacUser', ctrl]
    }
  });

  function ctrl($scope, $element, $location, FacUser) {
    var routers = {
      steefac: '/fac-detail/',
      steeproj: '/project-detail/',
    }

    $element.click( () => {
      var fac = $scope.fac;
      var type = 'steefac';
      var path = routers[type];

      console.log('DDDDDDDDDD', fac);
      FacUser.getPageReadLimit(type, fac.id)
      .then(limit =>{
        if(limit == 'never'){
          // 不受额度限制，直接打开
          $location.path(path + fac.id).search({});
          return;
        }
        FacUser.DjDialog.modal({
          title: `今日额度 ${limit.max} 条，已用 ${limit.used} 条`,
          body: `查看“${fac.name}”详情？`
        }).then(()=>{
          FacUser.applyReadDetail(type, fac.id).then(() =>{
            $location.path(path + fac.id).search({c:1});
          })
        }, (e) => {
          console.log('取消不看了');
        });
      })
      .catch(info => {
        FacUser.DjDialog.alert(info.text);
      })
    });
  }

})(window, angular);