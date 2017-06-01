'use strict';
(function(){

angular.module('appb')
.component('appbFeedInput',{
  templateUrl: 'modules/feed/appb-feed-input.component.template.html',  
  bindings: { 
    appData:"<",
    onPublish:"&", //回调参数名为feed： onPublish='onPublish(feed)'
    
    //pics 用单向绑定，外部变化能自动调用$onChange
    pics:"<",
    feedApp:"<",
    feedCat:"<",
    feed: "=",
    feedData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
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
        var type=ctrl.feedData.getFeedDefinitionType(ctrl.feedApp,ctrl.feedCat,name);
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
      
      ctrl.publish=function() {
        ctrl.feedData.publish(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks)
        .then(function(obj) {
          if('function' == typeof ctrl.onPublish) {
            $log.log('onPublish',obj);
            //发布成功，为提高性能，简化系统，
            //规定发布后把草稿中的 文字、图片 清空，其余不变
            ctrl.models.content='';//服务器在发布时也清空了
            ctrl.models.pics='';//服务器在发布时也清空了

            ctrl.onPublish({feed:obj});//回调参数名为feed： onPublish='onPublish(feed)'
          }
        });
      }
      ctrl.$onInit=function(){
        ctrl.formname='fm_'+(+new Date);
        ctrl.fcat= ctrl.feedData.feedAppCat(ctrl.feedApp,ctrl.feedCat);
        ctrl.fconfig=ctrl.feedData.getFeedDefinition(ctrl.feedApp,ctrl.feedCat);
        
        var item_d,name,realname,type;
        $timeout(wait_feed,10);
        function wait_feed(){
          $log.log('waiting_feed');
          if(!ctrl.feed)return $timeout(wait_feed,100);
          init_models_by_feed();
        }
        function init_models_by_feed(){
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
        intervalRes=$interval(function(){ctrl.feedData.updateDraft(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks)},15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        if( chg.pics) {
          if(ctrl.pics)ctrl.imgs=ctrl.pics.split(',');
          else ctrl.imgs=[];
        }

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.feedData.updateDraft(ctrl.feedApp,ctrl.feedCat,ctrl.feed,ctrl.changeMarks);
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
