'use strict';
(function(){

angular.module('appb')
.component('appbWeuiCheckbox',{
templateUrl: 'modules/appb-weui/appb-weui-checkbox.component.template.html',  
bindings: {
  checkData: '<',
},
  /*checkData=
  {
    title:
    names:[...]
    values:[...]
    
    
    footerText:
    footerLink:
    
  }
  */
controller: ['$scope','$log','$timeout','$location',
function ($scope,$log,$timeout,$location){
  var ctrl=this;
  
  ctrl.$onInit=function() {
  }
}]
})
})();
