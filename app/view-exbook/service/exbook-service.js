'use strict';
(function(){

angular.module('exbook')
.factory('ExbookService', 
['$log','$timeout',
function ($log,$timeout){
  var svc=this;
  var imgdata;
  svc.imgdata=imgdata={
    title:'题目2', maxCount:9, imgs:[ ], serverIds:[], apiFileIds:[]
  };

  return {
    getImgData:function(){return imgdata}
  }
         
}]);

//___________________________________
})();
