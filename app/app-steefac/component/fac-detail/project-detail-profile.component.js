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
      controller: ['$scope', '$element', '$http', 'ProjDefine', 'FacUser', 'SIGN', 'DjPop', ctrl]
    });


  function ctrl($scope, $element, $http, ProjDefine, FacUser, SIGN, DjPop) {
    $scope.ProjDefine = ProjDefine;
    $scope.type = 'steeproj';
    $scope.adminInfo = {
      count: 1,
      me: false
    };
    var ctrl = this;
    this.$onChanges = function (chg) {
      $scope.fac = ctrl.fac || {};
      if (!$scope.fac.id) return;
      $scope.sendtoIds = [$scope.fac.id];
      // 是否管理员
      $scope.isSuperAdmin = FacUser.isSysAdmin();
      $scope.adminInfo.me = FacUser.canAdminObj('steeproj', $scope.fac.id);
      SIGN.postLaolin('stee_user', 'get_admin_of_obj', { type: $scope.type, facid: $scope.fac.id }).then(function (json) {
        $scope.adminInfo = {
          me: $scope.adminInfo.me,
          admins: json,
          count: json.length
        }
      });
    }

    $http.post("用户/个人信息").then(json => {
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
    });

    $scope.showContactDlg = function () {
      var isService = $scope.user.rightIcons && $scope.user.rightIcons.find(row => row.name == "工作人员");
      if(!isService) return;
      return DjPop.show("dlg-contact-tel-prompt", {
        param: {
          fac: $scope.fac,
          type: $scope.type,
          user: $scope.user
        }
      });
    }

    $scope.closeFac = function(toClose){
      $http.post("sa_data/close_fac", { type: $scope.type, facid: $scope.fac.id, close: toClose }).then(json => {
        $scope.fac.close_time = toClose=='close';
      }).catch(e=>{
        //$scope.fac.close_time = toClose=='close';
      })
      ;
    }
  }
})(window, angular);