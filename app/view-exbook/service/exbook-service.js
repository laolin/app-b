'use strict';
(function(){

angular.module('exbook')
.factory('ExbookService', 
['$log','$timeout',
function ($log,$timeout){
  var svc=this;
  var imgdata;
  svc.imgdata=imgdata={
    topic:{ title:'题目', maxCount:3, imgs:[ ] },
    right:{ title:'答案', maxCount:3, imgs:[ ] },
    error:{ title:'错解', maxCount:3, imgs:[ ] }
  };

  return {
    getImgData:function(){return imgdata}
  }
         
}]);

//___________________________________
})();
