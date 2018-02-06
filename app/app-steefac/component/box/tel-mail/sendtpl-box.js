/**
 * 推送消息组件
 * ver: 0.0.1
 * build: 2018-01-05
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('sendtplBox',{
    templateUrl: 'app-steefac/component/box/tel-mail/sendtpl-box.template.html',
    bindings: {
      btnText : '<', // 可选
      typeFrom: '<', // 必需
      typeTo  : '<', // 必需
      idsFrom : '<', // 有，则用之，无，则从myData中提取
      idsTo   : '<', // 必需
      myData  : '<'  // 必需，若无，则组件将被隐藏。需含键: msg:{用量信息，必选}, objCanAdmin{管理的信息，必选}
    },
    controller:['$scope', '$element', 'SIGN', 'AppbAPI', ctrl]
  });


  function ctrl($scope, $element, SIGN, AppbAPI) {
    let typeA = {cn: '公司', en: 'steefac'};
    let typeB = {cn: '项目', en: 'steeproj'};
    var theTypes = $scope.theTypes = {
      from: {},
      to: {}
    };

    this.$onChanges = (chg) => {
      $scope.idsFrom = this.idsFrom;
      theTypes.from = this.typeFrom == 'steeproj' ? typeB : typeA;
      theTypes.to   = this.typeTo   == 'steeproj' ? typeB : typeA;
      console.log('idsFrom = ', this.idsFrom, ', myData = ', this.myData, ', theTypes = ', theTypes)
      if(!this.idsFrom && this.myData){
        var objCanAdminID = this.myData.objCanAdmin && this.myData.objCanAdmin[theTypes.from.en];
        console.log('从 myData 要列表， en = ', theTypes.from.en)
        console.log('objCanAdminID = ', objCanAdminID)
        if(objCanAdminID && objCanAdminID.length){
          AppbAPI('steeobj', 'li', {type: theTypes.from.en, ids: objCanAdminID.join(',')}).then( list => {
            $scope.list = list.map(item => {
              return {id: item.id, name: item.name};
            });
          })
        }
      }
    }

    /**
     * 对话框部分
     */
    $scope.showing = false;
    $scope.showDlg = () => {
      if(!$scope.list || !$scope.list.length){
        return;
      }
      SIGN.post('stee_msg', 'presend', {})
      .then( json => {
        $scope.limit = json.datas.limit[theTypes.from.en];
      });
      $scope.activeItem = false;
      // 如果只有一个，就直接选中
      if($scope.list.length == 1){
        $scope.activeItem = $scope.list[0];
      }
      $scope.showing = true;
    }

    $scope.activeItem = false;
    $scope.clickItem = (fac) => {
      $scope.activeItem = fac;
      console.log("fac = ", fac);
    }

    $scope.onClose = (btnName) => {
      if(btnName == "OK" && !$scope.activeItem) return false;
      console.log('按钮 = ', btnName);
      //return ;
      if(btnName == "OK"){
        var fac = $scope.activeItem;
        console.log("将" + theTypes.from.cn + "“" + fac.name + "”的情况推送到当前页的各" + theTypes.to.cn, fac.id)
        SIGN.post('stee_msg', 'send', {
          page     : location.origin + location.pathname,
          from_type: theTypes.from.en,
          from_id  : fac.id,
          to_type  : theTypes.to.en,
          to_ids   : this.idsTo,
        })
        .then( (json) => {
          console.log('已发送', json);
        })
        .catch( (e) => {
          console.log('发送失败', e);
        })
      }
    }


  }
})(window, angular);