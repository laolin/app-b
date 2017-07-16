'use strict';
(function(){

angular.module('appb')
.component('appbFeedInput',{
  templateUrl: 'modules/feed/appb-feed-input.component.template.html',  
  bindings: { 
    appData:"<",
    afterPublish:"&", //回调参数名为feed： after-publish='afterPublish(feed)'
    
    buttonText: "<",
    feedApp:"<",
    feedCat:"<",
    feed: "=",
    feedData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      //注，目前这样的设计只支持一个 'pics'
      ctrl.imgs=-1;//-1 as:the mark of not-init
      ctrl.models={};
      ctrl.changeMarks={}
      function markChange(key) {
        ctrl.changeMarks[key]= 1;// 1表示需要更新
      }

      
      ctrl.updateImg=function(imgs) {
        $log.log('feed==->',ctrl.feed);
        if(!ctrl.feed)return;//未初始化完成草稿（http未返回）
        ctrl.feed.pics=imgs.join(',');
        markChange('pics');
      }
      ctrl.changeModel=function(name) {
        if(!ctrl.feed){
          $log.log('no feed');
          return;//未初始化完成草稿（http未返回）
        }
        var type=ctrl.feedData.getFeedDefinitionType(ctrl.feedApp,name);
        var realname=name;
        var drft=ctrl.feed;
        //attr的下一级参数
        if(name.substr(0,5)=='attr_') {
          if(!ctrl.feed.attr)ctrl.feed.attr={}
          drft=ctrl.feed.attr;
          realname=name.substr(5);
        }
        
        markChange(name);
        if(type.substr(0,4)=='date') {
          drft[realname]=ctrl.models[name].toISOString()
          $log.log('drft==-|>',drft[realname]);
        } else {
          drft[realname]=ctrl.models[name];
        }
      }
      ctrl.onOk=function() {
        if(ctrl.feed.flag!='draft')
        return ctrl.feedData.updateFeed(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks)
        .then(function(obj) {
          return ctrl.afterPublish({feed:obj});//回调参数名为feed
        })
        
        return ctrl.feedData.publish(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks)
        .then(function(obj) {
          if('function' == typeof ctrl.afterPublish) {
            $log.log('afterPublish',obj);
            //发布成功，为提高性能，简化系统，
            //规定发布后把草稿中的 文字、图片 清空，其余不变
            ctrl.models.content='';//服务器在发布时也清空了
            ctrl.models.pics='';//服务器在发布时也清空了

            return ctrl.afterPublish({feed:obj});//回调参数名为feed
          }
        });
      }
      ctrl.$onInit=function(){
        ctrl.formname='fm_'+(+new Date);
        ctrl.fcat= ctrl.feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
        ctrl.fconfig=ctrl.feedData.getFeedDefinition(ctrl.feedApp);
        
        var item_d,name,realname,type;
        $timeout(wait_feed,10);
        function wait_feed(){
          $log.log('waiting_feed');
          if(!ctrl.feed)return $timeout(wait_feed,500);
          init_models_by_feed();
        }
        function init_models_by_feed(){
          //注，目前这样的设计只支持一个 'pics'
          if(ctrl.feed.pics)
            ctrl.imgs=ctrl.feed.pics.split(',');
          else
            ctrl.imgs=[];
          for(var i=ctrl.fconfig.columns.length;i--;) {
            realname=name=ctrl.fconfig.columns[i].name;
            if(name.substr(0,5)=='attr_') {
              realname=name.substr(5);
              item_d=ctrl.feed.attr[realname];
            } else {
              item_d=ctrl.feed[name];
            }
            type=ctrl.fconfig.columns[i].type;
            if(type.substr(0,4)=='date') {
              ctrl.models[name]=new Date( item_d);
            } else if(type =='number') {
              ctrl.models[name]= parseFloat( item_d) ;
            } else {
              ctrl.models[name]= item_d;
            }
          }
          $log.log('ctrl.models',ctrl.models);
        }
        $log.log('feed-input feedData:',ctrl.feedData);
        intervalRes=$interval(function(){ctrl.feedData.updateFeed(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks)},15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.feedData.updateFeed(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks);
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
