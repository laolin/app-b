
!(function (window, angular, undefined) {
  var theModule = angular.module("dj-view");

  theModule.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('frame.myreferedlist', {
        pageTitle: "我的关联人",
        url: '/myreferedlist',
        template: `
<div>
  <!--  搜索  -->
  <div class="padding5">
    <div class="input-group">
      <input type="text" class="form-control" ng-model="D.searchtext" placeholder="用户ID号、姓名、呢称、手机号、专业等">
      <span class="input-group-btn">
        <button class="btn btn-primary" type="button" ng-click="D.search()">
          <aaa class="hidden-xs">本页</aaa>搜索</button>
      </span>
    </div>
  </div>

  <!--  列表  -->
  <div class="sub img-row-em img-row-b1 hh6 border-bottom border-888 bk-fff" ng-repeat="user in D.list">
    <img ng-src="{{user.headimgurl}}" ng-click="previewself(user.headimgurl)">
    <a ng-href="{{is_service && ('#/frame/usershow?userid='+user.id) || ''}}" class="text1 color-00f">
      <span class="hh4">{{user.attr.name || user.name || '匿名'}}{{ (user.nickname && ( ' ('+ (user.nickname|cut:0:8)+')')) || ''}}</span>
    </a>
    <div class="text2 color-888">ID:{{user.id}}</div>
    <div class="r1">{{ ((user.userstate==3 && '用户')||'') + ((user.expertstate==3 && '　专家')||'') + ((user.servicestate==3 && '　编导')||'')}}</div>
    <div class="r2"></div>
  </div>

  <!--  分页  -->
  <div class="text-center">
    <ul class="pagination pageturn-row">
      <li ng-repeat="n in page.pageturn">
        <a ng-click="gotopage(n)" class="{{n==page.pagenow && 'active-page-number'}}">{{(n==1&&'&laquo;1')||(n==page.pagecount&&(n+'&raquo;'))||n}}</a>
      </li>
    </ul>
  </div>
</div>
        `,
        controller: ['$scope', '$http', ctrl]
      });
  }]);

  function ctrl($scope, $http) {
    if(!API.module)API.module = "user";
    $scope.is_service = false;
    var D = $scope.D = {
      hash_data: "frame.myreferedlist",
      pagesize: 8, 
      sublist: [{en:"all",cn:"全部"} ],
      baseAPI: "/user/getmyreferedlist",
      defaultlist: 0,
      post:{page: 0},
      searchtext:"",
      search: function(){
        D.post.searchtext = D.searchtext;
        D.post.page = 0;
        D.gotopage(D.post.page);
      }
    }
    InitSmartPage($scope, $scope.D);

  }


})(window, angular);
