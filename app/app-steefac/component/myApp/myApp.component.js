'use strict';

angular.module('steefac')
.component('myApp',{
  templateUrl: 'app-steefac/component/myApp/myApp.component.template.html',
  bindings: {
  },
  controller:['$scope', '$log', 'AppbData', function ($scope, $log, AppbData) {
    var appb = $scope.appb = {
      appData    : AppbData.getAppData(),
      headerData : AppbData.getHeaderData(),
      footerData : AppbData.getFooterData(),
      dialogData : AppbData.getDialogData()
    };

    appb.startPathMonitor=AppbData.startPathMonitor;
    //监控路由变化
    appb.startPathMonitor();
  }]
});

console.log('myApp 主组件加载！');
