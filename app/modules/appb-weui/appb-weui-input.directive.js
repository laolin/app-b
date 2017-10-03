'use strict';
(function(){

angular.module('appb')
.directive('appbWeuiInput',function() {return {
  restrict: 'AE',
  templateUrl: 'modules/appb-weui/appb-weui-input.directive.template.html',  
  scope: { 
    inputDefine:"<appbInputDefine",
  },
  controller: ['$scope', '$log','$element', function($scope,$log,$element){
    var cls='weui-cell'
    if($scope.inputDefine.type=='radio')
       cls+=' weui-cell_select weui-cell_select-after';
    $element.attr('class',cls);
  }]
}})


//___________________________________
})();
