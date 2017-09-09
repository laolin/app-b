'use strict';
(function(){

angular.module('steefac')
.factory('FacApi', ['$log','$timeout','AppbData',
function ($log,$timeout,AppbData){
  
  function createFac(data) {
    $log.log('FacApi.createFac',data);
  }
  
  return {
    createFac:createFac
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
