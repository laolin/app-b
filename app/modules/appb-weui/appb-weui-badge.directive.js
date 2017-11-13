'use strict';
(function(){
    
    
angular.module('appb')
.directive('appbWeuiBadge',['$compile','$log',function($compile,$log) {return {
  restrict: 'A',
  //templateUrl: 'modules/appb-weui/appb-weui-badge.directive.template.html',  
  scope: { 
    appbWeuiBadge:"<"
  },
  link: function (scope, element, attr) {
    if(!scope.appbWeuiBadge.show)return;
    // add keys directives
    var e0='<span class="weui-badge '+
      (scope.appbWeuiBadge.text?'':'weui-badge_dot')+'" '+
      ' style="position: absolute;top: -0.4em;right: -0.4em" '+
      '>' +
      (scope.appbWeuiBadge.text||'')+
      '</span>';
    
     
  
  
    var cp=$compile(e0)(scope);
    var keyEl = angular.element( cp );
    element.append(keyEl);
    element.attr('style','position:relative');
    //$log.log('lnnnnnnnk',scope,e0);

  },
  controller: ['$scope', '$log','$element', function($scope,$log,$element){/*
    var cls='weui-badge'
    if($scope.text=='')
       cls+=' weui-badge_dot';
    $element.attr('class',cls);
    if($scope.topr) {
      $element.attr('style','position: absolute,top: -0.4em,right: -0.4em');
    }
    else
      $element.attr('style','margin-left: 5px,margin-right: 5px');
  */    
  }]
}}])


//___________________________________
})();
