'use strict';
(function(){

angular.module('appb')
.factory('AppbUiDialogService', 
  ['$log','$timeout',
  function ($log,$timeout){

    var svc=this;
    svc.data={}
    svc.data.title='Hello';
    svc.data.content='Message';
    svc.data.btn1='OK';//点按钮1或2，
    svc.data.btn2='Option2';// 注意，有2个按钮时，按钮1在右边，2在左边
    svc.data.fn1=false;//点按钮1或2 后执行的回调函数
    svc.data.fn2=false;

    svc.data.show=false;
    svc.data.answer=0;//点按钮1或2后，其值=1或2
    
    function getData() {
      return svc.data;
    }
    function setData(d) {
      svc.data.title=d.title;
      svc.data.content=d.content;
      svc.data.btn1=d.btn1;
      svc.data.btn2=d.btn2;
      svc.data.fn1=d.fn1;
      svc.data.fn2=d.fn2;
      
      svc.data.show=d.show;
      svc.data.answer=0;
    }
    function show() {
      svc.data.show=true;
    }
    function hide() {
      svc.data.show=false;
    }
    return {
      setData:setData,
      getData:getData,
      show:show,
      hide:hide
    }
    
  }
])


//_________________________________
})();
