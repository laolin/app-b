'use strict';
(function(){
  
var defTitle=appbCfg.pageTitle;
var defBTitle=appbCfg.htmlTitle;

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
    '1':[ //link to root
      {side:'left',link:'/',icon:'chevron-left'}
    ],
    '-1':[ //go back
      {side:'left',link:'-1',icon:'chevron-left'}
    ],
    '_HOME':[
      {side:'left',link:'-1',icon:'home'},
      {side:'right',link:'/test-1',icon:'user'}
    ],
    '_TEST':[
      {side:'left',link:'/test-1',icon:'cubes'},
      {side:'left',link:'-1',text:'HOME'},
      //{side:'left',link:'javascript:;',img:'assets/img/logo-32.png',text:''},
      {side:'right',link:'/test-2',absUrl:0,icon:'battery-half'},
      {side:'right',link:'/test-3',absUrl:0,text:'测试中'}
    ],
    '_TEST2':[
      {side:'left',link:'-1',icon:'chevron-left'},
      {side:'right',link:'/test-3',icon:'battery-full'},
      {side:'right',link:'/test-2',text:'新版'}
    ]
  };
  activeHeader('1');
  
  //TODO: 验证 widgets 的有效性
  function addHeader(name,widgets) {
    headerAvailable[name]=widgets;
  }
  
  //使用指定name的header，也可同时指定 title
  //如果不指定 title, 就用 header[name].title
  function activeHeader(name,title,bTitle) {
    if(!headerAvailable[name]) {
      name='1';//不存在时，用默认的
    }
    headerData.title=title || defTitle;
    headerData.bTitle=bTitle || defBTitle;
    headerData.name=name;
    headerData.widgets=headerAvailable[name];

    $rootScope.pageTitle=headerData.bTitle;
  }
  function deleteHeader(name) {
    return delete headerAvailable[name];
  }
  //title 页面内上方的标题
  //bTitle 浏览器的标题
  //left 左侧链接 0=home, -1=back
  //right 右侧链接
  function setHeader(title,bTitle,left,right) {
    var auto_name ='__auto_name_%@&*-LONG-LONG';
    var w=[];
    if(left==1)w[0]=headerAvailable['1'][0];// link to home
    else if(left==-1) w[0]=headerAvailable['-1'][0];//go back link
    if(right)w=w.concat(right);
    $log.log('right',right,w);
    delete headerAvailable[auto_name];
    headerAvailable[auto_name]=w;
    activeHeader(auto_name,title,bTitle);
  }
  return {    
    addHeader:addHeader,
    activeHeader:activeHeader,
    deleteHeader:deleteHeader,
    
    setHeader:setHeader,
    
    getHeaderData:function(){return headerData}
  }
  
}]);
 
  
//___________________________________
})();
