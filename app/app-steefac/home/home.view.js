'use strict';
(function(){

angular.module('steefac')
.config(['$routeProvider', function($routeProvider) {
$routeProvider.when('/home', {
templateUrl: 'app-steefac/home/home.view.template.html',
controller: ['$scope','$log','$location','AppbData','SIGN','FacSearch','FacUser','SteeBuyer',
function ($scope,$log,$location,AppbData,SIGN,FacSearch,FacUser,SteeBuyer) {
  var userData=AppbData.getUserData();
  var appData=AppbData.getAppData();

  appData.setPageTitleAndWxShareTitle('CMOSS：可信、严肃、专业');
  

  var pa=appData.appCfg.assetsRoot+'/img/img-steefac/'

  $scope.pathImg=pa;

  /* 轮播数据 */
  var slider = $scope.slider = {
    frames: [
      {src: pa+"top-1.jpg", text:"一"},
      {src: pa+"top-2.jpg", text:"二"},
      {src: pa+"top-3.jpg", text:"三"}
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
    {src: pa+"hygs.png", text:"行业高手"},
    {src: pa+"xjsb.png", text:"新技术榜"},
    {src: pa+"cxpj.png", text:"诚信评级"},
    {src: pa+"gwbg.png", text:"顾问报告"}
  ];
  $scope.dataInfo = [
    { type:'steeproj', name: '项目信息', n: '...', t: '个'},
    { type:'steefac', name: '钢构厂', n: '...', t: '个'},
    { type:'', name: '采购商', n: '...', t: '家'}
  ];

  
  $scope.goSearch=function(type) {
    if(type)$location.path('/stat').search({type:type});
  }

  //使用ctrl, 后面方便切换为 component
  var ctrl=$scope.$ctrl={};
  // 使用 component 时
  //var ctrl=this;

  ctrl.userData=userData;
  ctrl.appData=appData;
  ctrl.FacUser=FacUser;
  ctrl.isLoading=3;

  FacUser.getMyData().then(function (me) {
    ctrl.isLoading--;
    $scope.dataInfo[0].n=me.counter.nProj;
    $scope.dataInfo[1].n=me.counter.nFac;
    //$scope.dataInfo[2].n='...';
  });
  ctrl.buyerList=SteeBuyer.buyerList;
  ctrl.links=[];
  ctrl.title0='最新采购商';
  for(var i= ctrl.buyerList.length;i--;) {
    ctrl.links[i]='/buyer?id='+ctrl.buyerList[i].oid;
  }
  
  
  ctrl.type1='steefac';
  SIGN.postLaolin('steeobj','search',{type:ctrl.type1,count:4}).then(
    function(s){
      ctrl.facList1=s;
      s[0].picMain=pa+'101.jpg';
      s[1].picMain=pa+'102.jpg';
      s[2].picMain=pa+'103.jpg';
      s[3].picMain=pa+'104.jpg';
      ctrl.title1='最新产能列表';
      ctrl.isLoading--;  
    }
  );
  
  ctrl.type2='steeproj';
  SIGN.postLaolin('steeobj','search',{type:ctrl.type2,count:6}).then(
    function(s){
      ctrl.facList2=s;
      s[0].picMain=pa+'201.jpg';
      s[1].picMain=pa+'202.jpg';
      s[2].picMain=pa+'203.jpg';
      s[3].picMain=pa+'204.jpg';
      s[4].picMain=pa+'205.jpg';
      s[5].picMain=pa+'206.jpg';
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
