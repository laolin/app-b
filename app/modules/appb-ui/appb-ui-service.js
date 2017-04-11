'use strict';
(function(){

angular.module('appb')
.factory('AppbUiService', 
  ['$log','$timeout','$document','$window',
  function ($log,$timeout,$document,$window){

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
    svc.galleryData={};
    svc.galleryData.imgs=[];
    svc.galleryData.show=false;
    //widgets[0]是在左侧的关闭按钮
    //widgets[1]设计为右侧动态的删除按钮
    svc.galleryData.headerData={
      widgets:[
        {side:'left',link:function(){svc.galleryData.show=false;},icon:'arrow-left'}        
      ],
      deleteButton:{side:'right',link:confirmDelImg,icon:'trash'},
      title:'0/0'
    };
    function confirmDelImg() {
      var d={
        title:'确认',
        content:'确定要删除图片么？',
        btn1:'删除!',
        btn2:'不删啦',
        fn1:svc.galleryData.deleteActiveSlide,
        show:1
      };
      setDialogData(d);
    }
    
    svc.galleryData.deleteActiveSlide=function(){
      if(!svc.galleryData.onDelete)return;
      $log.log('del no.',svc.galleryData.active);
      //只有一张，直接关掉
      if(1==svc.galleryData.imgs.length) {
        //svc.galleryData.imgs=[];//删除由eb-input自己完成
        svc.galleryData.show=false;
        svc.galleryData.onDelete(0);
        return;
      }
      
      svc.galleryData.onDelete(svc.galleryData.active);
      var newn=svc.galleryData.active-1;
      if(newn<0){
        newn=0;
      }
      svc.galleryData.swiper.slideTo(newn);
      svc.galleryData.active=newn;

      //svc.galleryData.imgs.splice(svc.galleryData.active,1); //删除由eb-input自己完成
      svc.galleryData.swiper.removeSlide(svc.galleryData.active);
      svc.galleryData.headerData.title=
        (1+svc.galleryData.swiper.activeIndex) + '/' + svc.galleryData.swiper.slides.length;
    }
    
    function showGallery(imgs,active_n,onDelete) {
      svc.galleryData.show=true;
      svc.galleryData.imgs=imgs;
      if('function' == typeof onDelete) {
        svc.galleryData.onDelete=onDelete;
        svc.galleryData.headerData.widgets[1]=svc.galleryData.headerData.deleteButton;
      } else {
        delete svc.galleryData.headerData.widgets[1];
      }
      if(!active_n)active_n=0;
      if(active_n>=imgs.length)active_n=imgs.length-1;
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
    
    
    // ---- inputData --------
    var inputData=svc.inputData={};
    inputData.showing=false;
    /**
     *  showBar(paras)参数paras说明：
     *  显示输入框，需要传入paras参数
     *  {
     *    type        : 【必须】'comment',...
     *    id          : 【必须】cid,...
     *    onOk        : 【必须】fun(inputs[xxId],paras[xxId]),
     *    onCancel    : fun(inputs[xxId],paras[xxId]),  
     *        上述两回调函数会收到两个参数，
     *        一个是input输入的内容，
     *        一个是打开时传入的paras
     *    placeholder : '回复xxx'...
     *    其他需要的参数，都会回传给onOk
     *  }
     *  
     *  
     *  根据传入的 paras，设置：
     *  1) inputData.activeId=paras.type+paras.id;
     *  2) inputData.paras[inputData.activeId] = paras
     *  3) 交互输入的内容放在 paras.__input （即paras会被增加一个元素）
     *  4) 点击确定后, 调用 :
     *    paras.onOk(paras); //paras.__input是输入的内容
     */
    inputData.paras={};
    inputData.type='';
    inputData.activeId=false;
    inputData.elementInputBar=false;//在component里初始化，表示InputBar的HTML element

    inputData.onOk=function() {
      var para=inputData.paras[inputData.activeId];
      if(!para) return -1;
      var fn=para.onOk;
      if('function' != typeof fn) return -2;
      inputData.showing=false;
      $document
        .off('ontouchend', inputData.hideBar)
        .off('click', inputData.hideBar);
      //$log.log('OFF ok..inputData.showBar');
      return fn(para);
    }
    
    /**
     *  inputData.showBar():
     *  见 inputData.paras 上方的说明
     */
    inputData.showBar=function(paras) {
      //$event.stopPropagation();
      inputData.showing=true;
      inputData.type=paras.type;
      inputData.activeId=paras.type+paras.id;
      if(!inputData.paras[inputData.activeId]) {
        inputData.paras[inputData.activeId]=paras;
      } else {
        angular.extend(inputData.paras[inputData.activeId],paras);
      }
      if(paras.type=='comment') {
        inputData.scrollToTheCommentEnd();
        angular.element($window).bind('resize', inputData.scrollToTheCommentEnd);
      }
      $document
        .off('ontouchend', inputData.hideBar)
        .off('click', inputData.hideBar);
      //$log.log('OFF.s..inputData.showBar');
      $timeout(function(){
        inputData.elementInputBar.querySelector('input').focus();
      },1)
      $timeout(function(){$document
        .on('ontouchend', inputData.hideBar)
        .on('click', inputData.hideBar);
        //$log.log('ON..inputData.showBar');
      },900)
    }
    inputData.hideBar=function(e) {
      var isInside=false;
      var ep=false;
      if(inputData.elementInputBar) {
        for (ep = e.target; ep; ep = ep.parentNode) {
          if (ep === inputData.elementInputBar) {
            isInside=true;
            break;
          }
        }
      } else {
        $log.log('(*)(?)Init error of inputData.elementInputBar');
      }
      if(!isInside) {
        inputData.showing=false;
        $timeout(function(){},1);//to apply scope
        $document
          .off('ontouchend', inputData.hideBar)
          .off('click', inputData.hideBar);
        //$log.log('OFF..inputData.showBar');
      }
    }
          
    inputData.scrollToTheCommentEnd=function() {
      if( ! inputData.showing || inputData.type !='comment') return;
      var e0=angular.element('.main-content-wrapper');
      var e1=angular.element('#eb-feed-end-'+inputData.paras[inputData.activeId].id);
      
      var y0=e0.scrollTop();
      var yOff=e0.outerHeight();
      var y1=e1.offset().top;
      //40是pageheader的高度 10是留的空白高度
      //实现：发表评论时评论框上方，正好是本帖的所有评论的底部(空白5px)
      e0.animate({scrollTop: y0+y1-yOff-40+10},"fast");
      
      
      //$location.hash('eb-feed-end-'+inputData.iid);
      //$anchorScroll.yOffset=-yOff-40;
      //$anchorScroll();
    }

    // ---- end inputData --------
    // ---- menuData --------
    var menuData=svc.menuData={};
    menuData.show=false;
    menuData.menus=[{text:'test 1',onClick:function(){$log.log('menu - 1')}}];
    menuData.showMenu=function(m,isModal) {
      menuData.show=true;
      menuData.isModal=isModal;
      menuData.menus=m;
    }
    
    // ---- end menuData --------

    return {
      getToastData:function(){return svc.toastData},
      toastHide:toastHide,
      toastLoading:toastLoading,
      toastDone:toastDone,
      toastMsg:toastMsg,

      getGalleryData:function(){return svc.galleryData},
      showGallery:showGallery,
      
      getInputData:function(){return svc.inputData},
      getMenuData:function(){return svc.menuData},

      setDialogData:setDialogData,
      getDialogData:getDialogData,
      showDialog:showDialog,
      hideDialog:hideDialog
    }
    
  }
])


//_________________________________
})();
