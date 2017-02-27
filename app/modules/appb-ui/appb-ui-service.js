'use strict';
(function(){

angular.module('appb')
.factory('AppbUiService', 
  ['$log','$timeout',
  function ($log,$timeout){

    var svc=this;
    svc.dialogData={}
    svc.dialogData.title='Hello';
    svc.dialogData.content='Message';
    svc.dialogData.btn1='OK';//点按钮1或2，
    svc.dialogData.btn2='Option2';// 注意，有2个按钮时，按钮1在右边，2在左边
    svc.dialogData.fn1=false;//点按钮1或2 后执行的回调函数
    svc.dialogData.fn2=false;

    svc.dialogData.show=false;
    svc.dialogData.answer=0;//点按钮1或2后，其值=1或2
    
    function getDialogData() {
      return svc.dialogData;
    }
    function setDialogData(d) {
      svc.dialogData.title=d.title;
      svc.dialogData.content=d.content;
      svc.dialogData.btn1=d.btn1;
      svc.dialogData.btn2=d.btn2;
      svc.dialogData.fn1=d.fn1;
      svc.dialogData.fn2=d.fn2;
      
      svc.dialogData.show=d.show;
      svc.dialogData.answer=0;
    }
    function showDialog() {
      svc.dialogData.show=true;
    }
    function hideDialog() {
      svc.dialogData.show=false;
    }
    
    
    svc.toastData='';
    function showToast() {
      svc.toastData='toast';
    }
    function hideToast() {
      svc.toastData='';
    }
    function showLoading() {
      svc.toastData='loading';
    }
    function hideLoading() {
      svc.toastData='';
    }
    
    return {
      getToastData:function(){return svc.toastData},
      showToast:showToast,
      hideToast:hideToast,
      showLoading:showLoading,
      hideLoading:hideLoading,
      
      setDialogData:setDialogData,
      getDialogData:getDialogData,
      showDialog:showDialog,
      hideDialog:hideDialog
    }
    
  }
])


//_________________________________
})();
