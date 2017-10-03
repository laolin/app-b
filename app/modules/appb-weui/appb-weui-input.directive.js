'use strict';
(function(){

angular.module('appb')
.directive('appbWeuiInput',function() {return {
  restrict: 'AE',
  templateUrl: 'modules/appb-weui/appb-weui-input.directive.template.html',  
  scope: { 
    inputDefine:"<appbInputDefine",
  },
}})


//___________________________________
})();
