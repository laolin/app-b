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
    
    // toast
    svc.toastTimer=false;
    svc.toastData={};
    function toastHide() {
      svc.toastData.type='';
      if(svc.toastTimer)$timeout.cancel(svc.toastTimer);
    }
    function toastLoading(seconds) {
      svc.toastData.type='loading';
      if(svc.toastTimer)$timeout.cancel(svc.toastTimer);
      if(seconds>0){
        svc.toastTimer=$timeout(toastHide,1000*seconds);
      }
    }
    function toastDone(seconds) {
      svc.toastData.type='done';
      if(svc.toastTimer)$timeout.cancel(svc.toastTimer);
      if(seconds>0){
        svc.toastTimer=$timeout(toastHide,1000*seconds);
      }
    }
    function toastMsg(msg,seconds) {
      svc.toastData.type='msg';
      svc.toastData.msg=msg?msg:'OK';
      if(svc.toastTimer)$timeout.cancel(svc.toastTimer);
      if(seconds>0){
        svc.toastTimer=$timeout( toastHide ,1000*seconds);
      }
    }
    
    //gallery
    svc.galleryData={abc:9.998}
    svc.galleryData.imgs=[];
    svc.galleryData.show=false;
    svc.galleryData.headerData={
      widgets:[{side:'right',link:function(){svc.galleryData.show=false;},icon:'close'}],
      title:'0/0'
    };
    
    function showGallery(imgs,active_n) {
      svc.galleryData.show=true;
      svc.galleryData.imgs=imgs;
      if(!active_n)active_n=0;
      svc.galleryData.active=active_n;
      svc.galleryData.headerData.title='1/'+imgs.length;
      
      //observer不灵，必须要重新new, 所以 让 if 总是 true
      // if( !svc.galleryData.swiper) {
      if(1){
        $timeout(function() {
          svc.galleryData.swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            onSlideChangeEnd:svc.galleryData.onNav,
            
            //onTouchStart:svc.galleryData.onTouchStart,
            //onTouchEnd  :svc.galleryData.onTouchEnd,
            //onClick     :svc.galleryData.onClick,
            onTap       :svc.galleryData.onTap,
            onDoubleTap :svc.galleryData.onDoubleTap,
            
            
            //observer: true, //ng-repeat更新dom后，swiper对象会自动更新各页内容
            //observeParents: true,
            
            
            
            paginationClickable: true
          });
          svc.galleryData.swiper.slideTo(active_n);
        },78);
      } else {
        svc.galleryData.swiper.slideTo(active_n);
      }
    }
    
    return {
      getToastData:function(){return svc.toastData},
      toastHide:toastHide,
      toastLoading:toastLoading,
      toastDone:toastDone,
      toastMsg:toastMsg,

      getGalleryData:function(){return svc.galleryData},
      showGallery:showGallery,
      
      setDialogData:setDialogData,
      getDialogData:getDialogData,
      showDialog:showDialog,
      hideDialog:hideDialog
    }
    
  }
])


//_________________________________
})();
