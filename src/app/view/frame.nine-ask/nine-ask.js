/*  九宫格视图  */

!(function (window, angular, undefined) {

  var theModule = angular.module("dj-view")
  theModule.config(["$stateProvider", function ($stateProvider) {

    $stateProvider.state('frame.nine-ask', {
      pageTitle: "登录",
      url: '/nine-ask',
      template: `
<div class="bk-ddd table-cell vw100">
  <div class="padding5">　</div>
  <div class="padding15 b900">热门分类，直击快速提问…</div>
  <div class="nine-icon-box">
    <div class="nine-icon" ng-repeat="item in nine track by $index" ng-click="quickAsk(item.text)">
      <d class="icon">
        <img ng-src="{{item.png}}">
      </d>
      <div class="text">{{item.text}}</div>
    </div>
  </div>
</div>
      `,
      controller: ['$scope', '$http', ctrl]
    })
  }]);


  function ctrl($scope, $http) {
    API.module = "user";
    $scope.nine = [
      {text:'装配式建筑', png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/建筑建材.png'},
      {text:'钢结构',     png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/优特钢.png'  },
      {text:'BIM',        png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/BIM.png'     },
      {text:'桥梁',       png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/桥梁.png'    },
      {text:'海外项目',   png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/项目.png'    },
      {text:'加固改造',   png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/安全加固.png'},
      {text:'耗能减震',   png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/能源.png'    },
      {text:'建筑设计',   png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/设计.png'    },
      {text:'其他',       png: 'http://qgs.oss-cn-shanghai.aliyuncs.com/sys/images/其他.png'    }
    ];
    $scope.quickAsk = function(major){
      window.location.href = "#/frame/toask?major=" + escape(escape(major));
    }
    
    WXAPP && WXAPP.setShare();//使用默认分享
  }
})(window, angular);
