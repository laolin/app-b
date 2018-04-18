/**
 * 公司详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {
  'use strict';

  angular.module('steefac')
    .component('facDetailProfile', {
      templateUrl: 'app-steefac/component/fac-detail/fac-detail-profile.template.html',
      bindings: {
        fac: '<'
      },
      controller: ['$scope', '$http', '$q', 'FacUser', 'SIGN', 'DjPop', ctrl]
    });


  function ctrl($scope, $http, $q, FacUser, SIGN, DjPop) {
    $scope.type = 'steefac';
    $scope.showVeryOld = false;
    $scope.reshowVeryOld = ()=>{
      $scope.showVeryOld = true;
    };
    $scope.adminInfo = {
      count: 1,
      me: false
    };

    var getMeData = $http.post("用户/个人信息").then(json => {
      $scope.user = json.datas;
      var str = json.datas.me['steeproj_can_admin'] || "";
      $scope.sendFromIds = str ? str.split(',') : [];

      /** 如果用户有[推送项目给产能]权限， 添加最近浏览记录到待推送列表 */
      if (json.datas.rightIcons && json.datas.rightIcons.find(row => row.name == '推送项目给产能')) {
        $http.post("cache/load", { ac: "fac-detail-history-steeproj" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          var adminIds = $scope.sendFromIds.length;
          var max = adminIds + list.length;
          for (var i = $scope.sendFromIds.length; i < 10 && i < max; i++) {
            $scope.sendFromIds.push(list.pop());
          }
        });
      }
      return $scope.user;
    });

    this.$onChanges = (changes)=> {
      if (changes.fac && changes.fac.currentValue) {
        $scope.fac = changes.fac.currentValue;
        $scope.sendtoIds = [$scope.fac.id];
        $q.when(getMeData).then(user => {
          // 是否管理员
          $scope.isSuperAdmin = user.isSysAdmin;
          var list = user.objAdmin[$scope.type] || [];
          $scope.adminInfo.me = list.find(id => id == $scope.fac.id);
          /** 读产能的所有管理员 */
          $http.post('stee_user/get_admin_of_obj', { type: $scope.type, facid: $scope.fac.id }).then(function (json) {
            console.log("get_admin_of_obj", json);
            $scope.adminInfo = {
              me: $scope.adminInfo.me,
              admins: json.data,
              count: json.data.length
            }
          })
        })
        $scope.fee = (function () {
          var fees = JSON.parse($scope.fac.fee || '{}');
          var totle = 0;
          var nFee = 0;
          for (var i in fees) {
            if (+fees[i] <= 0) continue;
            totle += +fees[i];
            nFee++;
          }
          return Math.floor(totle / (nFee || 1));
        })();
        /** 超过 两星期 未更新 */
        $scope.veryOld = new Date() / 1000 - $scope.fac.update_at > 14 * 24 * 3600;
      }
    }

    $scope.showContactDlg = (val) => {
      if ($scope.fac.contact_tel == 'yes') {
        $http.post("请求电话号码", { type: $scope.type, facid: $scope.fac.id }).then(json => {
          $scope.fac.contact_tel = json.datas.contact_tel;
          /* 记录用户点击 */
          $scope.$emit('require-log-user-action', { ac: '请求电话号码' });
        });
      }
      var isService = $scope.user.rightIcons && $scope.user.rightIcons.find(row => row.name == "工作人员");
      if (!isService) return;
      return DjPop.show("dlg-contact-tel-prompt", {
        param: {
          fac: $scope.fac,
          type: $scope.type,
          user: $scope.user
        }
      });
    }
  }
})(window, angular);