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
    feedData:"=" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      

      ctrl.maxTextLength=999;
      ctrl.models={};
      
      ctrl.updateImg=function(imgs) {
        var drft= ctrl.feedData.draftAll[ctrl.fcat];
        $log.log('drft==->',drft);
        if(!drft)return;//未初始化完成草稿（http未返回）
        drft.pics=imgs.join(',');
        ctrl.feedData.changeMark('pics');
      }
      ctrl.changeModel=function(name) {
        var drft= ctrl.feedData.draftAll[ctrl.fcat];
        
        if(!drft)return;//未初始化完成草稿（http未返回）
        var type=ctrl.feedData.getFeedDefinitionType(ctrl.feedApp,ctrl.feedCat,name);
        var realname=name;
        //attr的下一级参数
        if(name.substr(0,5)=='attr_') {
          if(!drft.attr)drft.attr={}
          drft=drft.attr;
          realname=name.substr(5);
          $log.log('drft.realname',realname,ctrl.feedData.draftAll[ctrl.fcat]);
        }
        
        if(type.substr(0,4)=='date') {
          drft[realname]=ctrl.models[name].toISOString()
          ctrl.feedData.changeMark(name);
          $log.log('drft==-|>',drft[realname]);
        } else {
          drft[realname]=ctrl.models[name];
          ctrl.feedData.changeMark(name)
        }
      }
      
      ctrl.publish=function() {
        ctrl.feedData.publish(ctrl.feedApp,ctrl.feedCat)
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
        
        var obj_draft,item_d,name,realname,type;
        ctrl.feedData.initDraft(ctrl.feedApp,ctrl.feedCat).then(function(){
          obj_draft=ctrl.feedData.draftAll[ctrl.fcat];
          for(var i=ctrl.fconfig.columns.length;i--;) {
            realname=name=ctrl.fconfig.columns[i].name;
            if(name.substr(0,5)=='attr_') {
              realname=name.substr(5);
              item_d=obj_draft.attr[realname];
            } else {
              item_d=obj_draft[name];
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
        })
        $log.log('feed-input feedData:',ctrl.feedData);
        intervalRes=$interval(function(){ctrl.feedData.updateData(ctrl.feedApp,ctrl.feedCat)},15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        if( chg.pics) {
          if(ctrl.pics)ctrl.imgs=ctrl.pics.split(',');
          else ctrl.imgs=[];
        }

      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        ctrl.feedData.updateData(ctrl.feedApp,ctrl.feedCat);
      }

      
      
      
      
      
    }
  ]
})


//___________________________________
})();
