'use strict';
(function(){

angular.module('appb')
.factory('AppbDataHeader',
['$route','$rootScope','$location','$log',
function($route, $rootScope,$location,$log) {

  var headerData={};
  this.headerData=headerData;

  // headerData
  // 链接默认都是app内部链接
  // '-1' 代表后退
  // 通过设定absUrl=1，可以跳到外部链接
  //
  // 默认的几种header样式：
  var headerAvailable=this.dataAvailable={
    '0':{title:'Welcome',widgets:[ //default widgets
      {side:'left',link:'-1',icon:'chevron-left'},
      {side:'right',link:'/111',icon:'user'}
    ]},
    '_L':{title:'欢迎',widgets:[
      {side:'left',link:'-1',icon:'chevron-left'}
    ]},
    '_R':{title:'标题',widgets:[
      {side:'right',link:'/user',icon:'user'}
    ]},
    '_HOME':{title:'Hello',widgets:[
      {side:'left',link:'/',icon:'home'},
      {side:'right',link:'/my',icon:'user'}
    ]},
    '_TEST':{title:'测试1',widgets:[
      {side:'left',link:'/default-settings',icon:'cubes'},
      {side:'left',link:'-1',text:'HOME'},
      //{side:'left',link:'javascript:;',img:'assets/img/logo-32.png',text:''},
      {side:'right',link:'http://laolin.com',absUrl:1,icon:'battery-half'},
      {side:'right',link:'/',absUrl:1,text:'测试中'}
    ]},
    '_TEST2':{title:'测试2',widgets:[
      {side:'left',link:'-1',icon:'chevron-left'},
      {side:'right',link:'/power',icon:'battery-full'},
      {side:'right',link:'/test',text:'新版'}
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
