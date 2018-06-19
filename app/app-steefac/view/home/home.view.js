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

        <!-- 最新产能列表 -->
        <div class="main-fac-list" ng-if='newlyList.steefac.length'>
          <div class="title weui-cell_access">
            <span class="title-text">{{titles.steefac}}</span>
            <div class="weui-cell__ft" ng-click='goSearch("steefac")'>查看更多</div>
          </div>
          <a class="flex flex-between flex-stretch item" ng-repeat="item in newlyList.steefac" fac-show-prompt="item" type="steefac">
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
        <div class="main-fac-list list2" ng-if='newlyList.steeproj.length'>
          <div class="title weui-cell_access">
            <span class="title-text">{{titles.steeproj}}</span>
            <div class="weui-cell__ft" ng-click='goSearch("steeproj")'>查看更多</div>
          </div>
          <div class="items">
            <fac-grids fac-list="newlyList.steeproj" type="'steeproj'"></fac-grids>
          </div>
        </div>

        <appb-ui-loading ng-if="!newlyList.steefac.length || !newlyList.steeproj.length"></appb-ui-loading>

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
      controller: ['$scope', '$http', '$q', '$location', 'AppbData', ctrl
      ]
    })
  }]);

  var pageCache = {};

  function ctrl($scope, $http, $q, $location, AppbData) {
    //var userData = AppbData.getUserData();
    //ctrl.userData = userData;
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


    $scope.goSearch = function (type) {
      if (type) $location.path('/stat').search({ type: type });
    }

    $scope.titles = {
      steefac: '最新产能列表',
      steeproj: '最新项目列表',
    };
    var newlyList = $scope.newlyList = pageCache || (pageCache = {
      steefac: [],
      steeproj: [],
    });
    var get_steefac = $http.post('stee_data/search', { type: 'steefac', count: 4 })
      .then(json => json.datas.list)
      .then(list => {
        newlyList.steefac = list;
        list[0].picMain = pa + '101.jpg';
        list[1].picMain = pa + '102.jpg';
        list[2].picMain = pa + '103.jpg';
        list[3].picMain = pa + '104.jpg';
      });

    var get_steeproj = $http.post('stee_data/search', { type: 'steeproj', count: 6 })
      .then(json => json.datas.list)
      .then(list => {
        newlyList.steeproj = list;
        list[0].picMain = pa + '201.jpg';
        list[1].picMain = pa + '202.jpg';
        list[2].picMain = pa + '203.jpg';
        list[3].picMain = pa + '204.jpg';
        list[4].picMain = pa + '205.jpg';
        list[5].picMain = pa + '206.jpg';
      });
  }

})(window, window.angular);
