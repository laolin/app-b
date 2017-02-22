'use strict';
(function(){

angular.module('appb')
.component('appbUiHeader',{
    templateUrl: 'modules/appb-ui/appb-ui-header.template.html',
    bindings: {
      headerData: '='
    },
    controller: ['$scope','$log','$timeout','$location', 
    function ($scope,$log,$timeout,$location){
   
      
    }]
})

//________________________________
})();
