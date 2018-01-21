/**
 * 搜索结果组件
 * 功能：左右轮播模式
 * ver: 0.0.2
 * build: 2018-01-21
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('searchResultSwiper', {
    templateUrl: 'app-steefac/component/search/search-result-swiper.template.html',
    bindings: {
      result: '<',
      type: '<'
    },
    controller:['$scope', '$location', 'FacSearch', 'ProjDefine', ctrl]
  });

	function ctrl($scope, $location, FacSearch, ProjDefine) {
    $scope.FacSearch = FacSearch;
    $scope.ProjDefine = ProjDefine;
    var ctrl=this;
    ctrl.$onChanges=function(chg){
      //$scope.dataReady = !!ctrl.result;
      initPage();
    }

    /**
     * 分页
     */
    var pageLength = 6;
    $scope.pages = [];
    function initPage(){
      $scope.pages = [[]];
      if(!ctrl.result) return;
      var length = ctrl.result.length || 0;
      var thisPage = $scope.pages[0];
      for(var i = 0; i<length; i++ ){
        if(i && (i % pageLength) == 0){
          thisPage = [];
          $scope.pages.push(thisPage);
        }
        thisPage.push(ctrl.result[i]);
      }
      $scope.dataReady = length;
      console.log('分页结果：', $scope.pages);
    }

    /* 轮播数据 */
    var slider = $scope.slider = {
      params: {
        centeredSlides: true,
        spaceBetween: 20,
        loop: false,
        initialSlide: 1,
        showNavButtons: true,
        slidesPerView: 1
      },
      onReady: function(swiper){
        swiper.on('slideChangeEnd', function () {
        });
      }
    };

    /**
     * 点击
     */
    var routers = {
      steefac: '/fac-detail/',
      steeproj: '/project-detail/',
    }
    $scope.clickItem = function(item){
      console.log(item);
      return $location.path(routers[ctrl.type] + item.id).search({});
    }
  }
})(window, angular);