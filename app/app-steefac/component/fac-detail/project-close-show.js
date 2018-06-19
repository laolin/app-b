/**
 * 项目详情-关闭时显示的组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {

  angular.module('steefac').component('projectCloseShow', {
    template: `
<div class="flex-v detail-close">
  <div class="flex flex-left row">
    <span class="text-gray">项目名称</span>
    <span class="text-3 b-900">{{$ctrl.fac.name}}</span>
  </div>
  <div class="flex flex-left row">
    <span class="text-gray">状态:</span>
    <span class="text-3 row closed">
      已关闭
      <img class="closed" src="https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets/img/img-steefac/close.png">
    </span>
  </div>
  <div class="flex flex-left row">
    <span class="text-gray">关闭原因</span>
    <span class="text-3">{{reason[closeData.data.mode]}}</span>
    <span class="text-gray" ng-if="closeData.data.remark">({{closeData.data.remark}})</span>
    <span class="text-gray" ng-if="closeData.data.proj">( 项目: <a ng-path="/fac-detail/{{closeData.data.proj}}">点击查看</a> )</span>
  </div>
</div>
      `,
    bindings: {
      fac: '<'
    },
    controller: ['$scope', '$q', '$http', ctrl]
  });


  function ctrl($scope, $q, $http) {

    $http.post("获取下拉列表", "项目关闭原因").then(datas => {
      var list = datas.list;
      console.log("项目关闭原因", datas)
      $scope.reason = {};
      list.map(item => {
        $scope.reason[item.value] = item.title;
      })
    }).catch(e=>{
      console.log("项目关闭原因, e =", e)
    });
    this.$onChanges = (changes) => {
      if(changes.fac){
        var fac = changes.fac.currentValue;
        if(fac && fac.attr && angular.isArray(fac.attr.close_data_history)){
          $scope.closeData = fac.attr.close_data_history[fac.attr.close_data_history.length - 1];
        }
      }
      console.log("项目 =", changes)
    }


    $scope.openFac = function (toClose) {
      $http.post("产能操作/关闭项目", { fac: $scope.fac, close: 'open' }).then(json => {
        $scope.fac.close_time = toClose == 'close';
      }).catch(e => {
        console.error("关闭项目 error:", e);
      });
    }
  }
})(window, angular);