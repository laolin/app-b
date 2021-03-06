'use strict';
(function(){

angular.module('appb')
.component('appbUiHeader',{
  templateUrl: 'modules/appb-ui/appb-ui-header.template.html',
  bindings: {
    headerData: '<'
  },
  controller: ['$scope','$log','$timeout','$location','$window',
  function ($scope,$log,$timeout,$location,$window){
    var ctrl=this;
    ctrl.$onChanges=function(chg) {
    }
    ctrl.goLink = function(k,abs) {
      if('function' == typeof k) {
        k();
        return true;
      }
      if( k === '-1' ) {
        $window.history.back();
        return true;
      }
      /*if(k.substr(0,7)=='http://' || k.substr(0,8)=='https://') {
        $log.log(2,k);
        location.href=k;
        return false;
      }*/
      if(abs) {
        location.href=k;
        return false;
      }
      $location.path(k);
      return true;
    };
  }]
})

//________________________________
})();
