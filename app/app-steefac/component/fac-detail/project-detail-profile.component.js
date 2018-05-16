/**
 * 项目详情-简介组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined) {

  angular.module('steefac')
    .component('projectDetailProfile', {
      templateUrl: 'app-steefac/component/fac-detail/project-detail-profile.template.html',
      bindings: {
        fac: '<'
      },
      controller: ['$scope', '$q', '$http', 'ProjDefine', ctrl]
    });


  function ctrl($scope, $q, $http, ProjDefine) {
    $scope.ProjDefine = ProjDefine;
    $scope.showVeryOld = false;
    $scope.reshowVeryOld = ()=>{
      $scope.showVeryOld = true;
    };
    $scope.type = 'steeproj';
    $scope.adminInfo = {
      count: 1,
      me: false
    };

    var getMeData = $http.post("用户/个人信息").then(json => {
      $scope.user = json.datas;
      var str = json.datas.me['steefac_can_admin'] || "";
      $scope.sendFromIds = str ? str.split(',') : [];

      $scope.canClose = json.datas.rightIcons.find(row => row.name == '关闭项目');

      /** 如果用户有[推送产能给项目]权限， 添加最近浏览记录到待推送列表 */
      if (json.datas.rightIcons && json.datas.rightIcons.find(row => row.name == '推送产能给项目')) {
        $http.post("cache/load", { ac: "fac-detail-history-steefac" }).then(json => {
          var list = json.datas.data;
          if (!angular.isArray(list)) list = [];
          var adminIds = $scope.sendFromIds.length;
          var max = adminIds + list.length;
          for (var i = $scope.sendFromIds.length; i < 10 && i < max; i++) {
            var historyId = list.pop();
            if (!$scope.sendFromIds.find(id => id == historyId)) {
              $scope.sendFromIds.push(historyId);
            }
          }
        });
      }
      return $scope.user;
    });

    this.$onChanges = (changes) => {
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
            $scope.adminInfo = {
              me: $scope.adminInfo.me,
              admins: json.data,
              count: json.data.length
            }
          })
        })
        /** 超过 两星期 未更新 */
        $scope.veryOld = new Date() / 1000 - $scope.fac.update_at > 14 * 24 * 3600;
      }
    }

    $scope.showContactDlg = function () {
      if ($scope.fac.contact_tel == 'yes') {
        $http.post("请求电话号码", { type: $scope.type, facid: $scope.fac.id }).then(json => {
          $scope.fac.contact_tel = json.datas.contact_tel;
          /* 记录用户点击 */
          $scope.$emit('require-log-user-action', { ac: '请求电话号码' });
        });
      }
      var isService = $scope.user.rightIcons && $scope.user.rightIcons.find(row => row.name == "工作人员");
      if (!isService) return;
      return $http.post("显示对话框/dialog", {
        componentName: "dlg-contact-tel-prompt",
        params: {
          fac: $scope.fac,
          type: $scope.type,
          user: $scope.user
        },
      });
    }

    $scope.closeFac = function (toClose) {
      $http.post("产能操作/关闭项目", {fac: $scope.fac, close: toClose}).then(json => {
        $scope.fac.close_time = toClose == 'close';
      }).catch(e => {
        console.error("关闭项目 error:", e);
      });
    }
  }
})(window, angular);