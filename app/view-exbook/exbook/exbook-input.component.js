'use strict';
(function(){

angular.module('exbook')
.component('exbookInput',{
  templateUrl: 'view-exbook/exbook/exbook-input.component.template.html',  
  bindings: { 
    appData:"<",
    //注意，
    // 本 component 里修改了 ebData 的值
    // 这里 ebData 虽然是“单向绑定”，
    // 但其实传递来的是变量的引用，所以是双向影响值的
    //用单向绑定，目的是为了外部变化能自动调用$onChange
    ebData:"<" 
  },
  controller: ['$log','$timeout','$interval','$http',
    function ($log,$timeout,$interval,$http){
      var ctrl=this;
      var intervalRes;
      var isUpdating=false;
      

      ctrl.dataChanged={ 
        grade:0,
        course:0,
        content:0,
        pics:0,
        anonymous:0
      }
      ctrl.updateImg=function(img) {
        ctrl.ebData.draft.pics=img.join(',');
        ctrl.changeMark('pics');
      }
      ctrl.$onInit=function(){
        $log.log('ebData',ctrl.ebData);
        intervalRes=$interval(updateData,15*1000);//n秒
      }
      ctrl.$onChanges =function(chg){
        $log.log(' 2 ** exbookInput onChanges',chg);
      }
      ctrl.$onDestroy=function(){
        $interval.cancel(intervalRes);
        updateData();
      }
      
      function updateData() {
        if(isUpdating)return;
        //$log.log('updateData',ctrl.ebData.draft);
        var data={}
        var dirty=false;
        for (var attr in ctrl.dataChanged) {
          if(1 == ctrl.dataChanged[attr]) { // 1表示需要更新
            dirty=true;
            data[attr]=ctrl.ebData.draft[attr];
            ctrl.dataChanged[attr]=2;//2 表示正在更新中
          }
        }

        if(!dirty)return;
        isUpdating=true;
        var api=ctrl.appData.urlSignApi('exbook','draft_update');
        if(!api){
          ctrl.appData.requireLogin();//没有登录时 需要验证的 api 地址是空的
        }
        data.fid=ctrl.ebData.draft.fid;
        $http.jsonp(api, {params:data})//TODO : 出错处理
          .then(function(s){
             for (var attr in ctrl.dataChanged) {
              if(2 == ctrl.dataChanged[attr])// 2 更新成功->0
                ctrl.dataChanged[attr]=0;                    
            }
            //ctrl.appData.toastMsg('draft updated',3);
            isUpdating=false;
          },function(e){
             for (var attr in ctrl.dataChanged) {
              if(2 == ctrl.dataChanged[attr])// 2 更新失败->1
                ctrl.dataChanged[attr]=1;                    
            }
            ctrl.appData.toastMsg('draft updated error');
            isUpdating=false;
          })
      }
      ctrl.changeMark=function(key) {
        ctrl.dataChanged[key]= 1;// 1表示需要更新
      }
    }
  ]
})


//___________________________________
})();
