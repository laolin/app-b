!(function (window, angular, undefined) {

  angular.module('steefac').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      template: `
        <!-- 轮播 -->
        <div class="main-swiper">
          <ks-swiper-container
            override-parameters="slider.params"
            on-ready="slider.onReady(swiper)"
          >
            <ks-swiper-slide class="box" ng-repeat="item in slider.frames">
              <img class="" ng-src="{{item.src}}">
            </ks-swiper-slide>
          </ks-swiper-container>
        </div>

        <div class="main-modules flex" ng-if="0">
          <div class="module flex-v flex-w1 flex-center" ng-repeat="item in moduleInfo">
            <img ng-src="{{item.src}}">
            <span>{{item.text}}</span>
          </div>
        </div>

        <div class="main-datainfo flex flex-between" ng-if="0">
          <div class="item flex-v" ng-repeat="item in dataInfo"
            ng-click='goSearch(item.type)'
          >
            <div class="name">{{item.name}}</div>
            <div class="info flex"><div class="n">{{item.n}}</div><div class="t">{{item.t}}</div></div>
          </div>
        </div>

        <appb-ui-loading ng-if='$ctrl.isLoading>0'></appb-ui-loading>

        <!-- 最新产能列表 -->
        <div class="main-fac-list" ng-if='$ctrl.isLoading <=0'>
          <div class="title weui-cell_access">
            <span class="title-text">{{$ctrl.title1}}</span>
            <div class="weui-cell__ft" ng-click='goSearch("steefac")'>查看更多</div>
          </div>
          <!--fac-grids
          fac-list='$ctrl.facList1'
          type='"steefac"'
          >
          </fac-grids-->
          <a class="flex flex-between flex-stretch item" ng-repeat="item in $ctrl.facList1" fac-show-prompt="item" type="steefac">
            <div class="left flex-v flex-between flex-grow">
              <div class="text">{{item.name}}，产能{{item.cap_6m}}吨，擅长构件：{{item.goodat}}</div>
              <i class="fa fa-clock-o">&nbsp;
                <span ng-if='item.update_at>123456789' am-time-ago='1000*item.update_at' ></span>
              </i>
            </div>
            <div class="shrink0 img">
              <img ng-src="{{item.picMain || '../assets/img/img-steefac/def-steefac.jpg' }} " alt="">
            </div>
          </a>
        </div>

        <!-- 最新项目列表 -->
        <div class="main-fac-list list2" ng-if='$ctrl.isLoading <=0'>
          <div class="title weui-cell_access">
            <span class="title-text">{{$ctrl.title2}}</span>
            <div class="weui-cell__ft" ng-click='goSearch("steeproj")'>查看更多</div>
          </div>
          <div class="items">
            <fac-grids
              fac-list='$ctrl.facList2'
              type='"steeproj"'
            >
            </fac-grids>
          </div>
        </div>

        <!-- 采购商 -->
        <div class="main-cgs">
          <div class="title">
            <span>—</span><span class="text">　采购商　</span><span>—</span>
          </div>
          <img ng-src="{{pathImg}}cgs.jpg">
        </div>
        <div class="main-cgs-more weui-cell_access">
          <span class="weui-cell__ft">查看更多</span>
        </div>

        <fac-ui-copyright></fac-ui-copyright>
      `,
      controller: ['$scope', '$log', '$location', 'AppbData', 'SIGN', 'FacSearch', 'FacUser', 'SteeBuyer', ctrl
      ]
    })
  }]);

  function ctrl($scope, $log, $location, AppbData, SIGN, FacSearch, FacUser, SteeBuyer) {
    var userData = AppbData.getUserData();
    var appData = AppbData.getAppData();

    appData.setPageTitleAndWxShareTitle('CMOSS：可信、严肃、专业');


    var pa = appData.appCfg.assetsRoot + '/img/img-steefac/'

    $scope.pathImg = pa;

    /* 轮播数据 */
    var slider = $scope.slider = {
      frames: [
        { src: pa + "top-1.jpg", text: "一" },
        { src: pa + "top-2.jpg", text: "二" },
        { src: pa + "top-3.jpg", text: "三" }
      ],
      params: {
        centeredSlides: true,
        spaceBetween: 20,
        autoplay: 600,
        loop: true,
        initialSlide: 1,
        showNavButtons: false,
        slidesPerView: 1.15
      },
      onReady: function (swiper) {
        swiper.on('slideChangeEnd', function () {
          if (swiper.params.autoplay < 1500) {
            // 越来越慢，直到1.5秒/帧
            swiper.params.autoplay += 300;
            swiper.startAutoplay();
          } else {
            // 如果想在手动滑一下后停下来，就注释下面代码
            swiper.startAutoplay();
          }
        });
        swiper.slideNext();
      }
    };

    $scope.moduleInfo = [
      { src: pa + "hygs.png", text: "行业高手" },
      { src: pa + "xjsb.png", text: "新技术榜" },
      { src: pa + "cxpj.png", text: "诚信评级" },
      { src: pa + "gwbg.png", text: "顾问报告" }
    ];
    $scope.dataInfo = [
      { type: 'steeproj', name: '项目信息', n: '...', t: '个' },
      { type: 'steefac', name: '钢构厂', n: '...', t: '个' },
      { type: '', name: '采购商', n: '...', t: '家' }
    ];


    $scope.goSearch = function (type) {
      if (type) $location.path('/stat').search({ type: type });
    }

    //使用ctrl, 后面方便切换为 component
    var ctrl = $scope.$ctrl = {};
    // 使用 component 时
    //var ctrl=this;

    ctrl.userData = userData;
    ctrl.appData = appData;
    ctrl.FacUser = FacUser;
    ctrl.isLoading = 3;

    FacUser.getMyData().then(function (me) {
      ctrl.isLoading--;
      $scope.dataInfo[0].n = me.counter.nProj;
      $scope.dataInfo[1].n = me.counter.nFac;
      //$scope.dataInfo[2].n='...';
    });
    ctrl.buyerList = SteeBuyer.buyerList;
    ctrl.links = [];
    ctrl.title0 = '最新采购商';
    for (var i = ctrl.buyerList.length; i--;) {
      ctrl.links[i] = '/buyer?id=' + ctrl.buyerList[i].oid;
    }


    ctrl.type1 = 'steefac';
    SIGN.postLaolin('steeobj', 'search', { type: ctrl.type1, count: 4 }).then(
      function (s) {
        ctrl.facList1 = s;
        s[0].picMain = pa + '101.jpg';
        s[1].picMain = pa + '102.jpg';
        s[2].picMain = pa + '103.jpg';
        s[3].picMain = pa + '104.jpg';
        ctrl.title1 = '最新产能列表';
        ctrl.isLoading--;
      }
    );

    ctrl.type2 = 'steeproj';
    SIGN.postLaolin('steeobj', 'search', { type: ctrl.type2, count: 6 }).then(
      function (s) {
        ctrl.facList2 = s;
        s[0].picMain = pa + '201.jpg';
        s[1].picMain = pa + '202.jpg';
        s[2].picMain = pa + '203.jpg';
        s[3].picMain = pa + '204.jpg';
        s[4].picMain = pa + '205.jpg';
        s[5].picMain = pa + '206.jpg';
        ctrl.title2 = '最新项目列表';
        ctrl.isLoading--;
      }
    );

    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('$destroy', function () {
    });
  }

})(window, window.angular);
