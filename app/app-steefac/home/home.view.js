'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/home', {
templateUrl: 'app-steefac/home/home.view.template.html',
controller: ['$scope','$log','AppbData','AppbAPI','FacSearch','FacUser','SteeBuyer',
function ($scope,$log,AppbData,AppbAPI,FacSearch,FacUser,SteeBuyer) {
  var userData=AppbData.getUserData();
  var appData=AppbData.getAppData();

  /* 轮播数据 */
  var slider = $scope.slider = {
    frames: [
      {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/top-1.jpg", text:"一"},
      {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/top-2.jpg", text:"二"},
      {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/top-3.jpg", text:"三"}
    ],
    params: {
      centeredSlides: true,
      spaceBetween: 20,
      autoplay: 600,
      loop: true,
      initialSlide: 1,
      showNavButtons: false,
      slidesPerView: 1.2
    },
    onReady: function(swiper){
      swiper.on('slideChangeEnd', function () {
        if(swiper.params.autoplay < 1500){
          // 越来越慢，直到1.5秒/帧
          swiper.params.autoplay += 300;
          swiper.startAutoplay();
        }else{
          // 如果想在手动滑一下后停下来，就注释下面代码
          swiper.startAutoplay();
        }
      });
      swiper.slideNext();
    }
  };

  $scope.moduleInfo = [
    {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/hygs.png", text:"行业高手"},
    {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/xjsb.png", text:"新技术榜"},
    {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/cxpj.png", text:"诚信评级"},
    {src: "http://qgs.oss-cn-shanghai.aliyuncs.com/app-b/images/gwbg.png", text:"顾问报告"}
  ];
  $scope.dataInfo = [
    { name: '项目信息', n: '...', t: '个'},
    { name: '钢构厂', n: '...', t: '个'},
    { name: '采购商', n: '...', t: '家'}
  ];

  appData.setPageTitle('CMOSS：可信、严肃、专业');
  
  //要求登录，如果未登录，会自动跳转到登录界面
  appData.requireLogin();

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  // 使用 component 时
  //var ctrl=this;

  ctrl.userData=userData;
  ctrl.appData=appData;
  ctrl.FacUser=FacUser;
  ctrl.isLoading=3;
  ctrl.headImg=appData.appCfg.assetsRoot+'/img/img-steefac/stee-title-1.jpg';

  FacUser.getMyData().then(function (me) {
    ctrl.isLoading--;
    $scope.dataInfo = [
      { name: '项目信息', n: me.counter.nProj, t: '个'},
      { name: '钢构厂', n: me.counter.nFac, t: '个'},
      { name: '采购商', n: '...', t: '家'}
    ];
  });
  ctrl.buyerList=SteeBuyer.buyerList;
  ctrl.links=[];
  ctrl.title0='最新采购商';
  for(var i= ctrl.buyerList.length;i--;) {
    ctrl.links[i]='/buyer?id='+ctrl.buyerList[i].oid;
  }
  
  ctrl.type1='steefac';
  AppbAPI('steeobj','search',{type:ctrl.type1,count:4}).then(
    function(s){
      ctrl.facList1=s;
      ctrl.title1='最新产能列表';
      ctrl.isLoading--;  
    }
  );
  
  ctrl.type2='steeproj';
  AppbAPI('steeobj','search',{type:ctrl.type2,count:6}).then(
    function(s){
      ctrl.facList2=s;
      ctrl.title2='最新项目列表';
      ctrl.isLoading--;  
    }
  );
  
  $scope.$on('$viewContentLoaded', function () {
  });
  $scope.$on('$destroy', function () {
  });

  
  

}]
})
}]);

//___________________________________
})();
