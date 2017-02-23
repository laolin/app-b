'use strict';
(function(){

angular.module('appb')
.factory('AppbDataHeader',
['$route','$rootScope','$location','$log',
function($route, $rootScope,$location,$log) {

  var headerData={};
  this.headerData=headerData;

  // headerData
  // 链接需要正常的html的地址格式，
  // angular path 均要写上 #!，因为链接可能是外部链接
  // 默认几种header样式：
  var headerAvailable=this.dataAvailable={
    '0':{title:'Welcome',widgets:[ //default widgets
      {side:'left',link:'#!/111',icon:'chevron-left'},
      {side:'right',link:'#!/111',icon:'user'}
    ]},
    '_L':{title:'欢迎',widgets:[ //default widgets
      {side:'left',link:'#!/111',icon:'chevron-left'}
    ]},
    '_R':{title:'标题',widgets:[ //default widgets
      {side:'right',link:'#!/111',icon:'user'}
    ]},
    '_TEST':{title:'测试1',widgets:[ //default widgets
      {side:'left',link:'#!/test',icon:'cubes'},
      {side:'left',link:'#!/',text:'HOME'},
      //{side:'left',link:'javascript:;',img:'assets/img/logo-32.png',text:''},
      {side:'right',link:'#!/power',icon:'battery-half'},
      {side:'right',link:'#!/default-settings',text:'测试中'}
    ]},
    '_TEST2':{title:'测试2',widgets:[ //default widgets
      {side:'left',link:'#!/111',icon:'chevron-left'},
      {side:'right',link:'#!/p1',icon:'battery-full'},
      {side:'right',link:'#!/d1',text:'新版'}
    ]}
  };
  activeHeader('0','');
  
  //TODO: 验证 widgets 的有效性
  function addHeader(name,title,widgets) {
    headerAvailable[name]={title:title,widgets:widgets};
  }
  
  //使用指定name的header，也可同时指定 title
  //如果不指定 title, 就用 header[name].title
  function activeHeader(name,title) {
    if(!headerAvailable[name]) {
      name='0';//不存在时，用默认的
    }
    headerData.title=title || headerAvailable[name].title;
    headerData.name=name;
    headerData.widgets=headerAvailable[name].widgets;

    $rootScope.pageTitle=headerData.title;
  }
  function deleteHeader(name) {
    return delete headerAvailable[name];
  }

  return {    
    addHeader:addHeader,
    activeHeader:activeHeader,
    deleteHeader:deleteHeader,
    
    getHeaderData:function(){return headerData}
  }
  
}]);
 
  
//___________________________________
})();
