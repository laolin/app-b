'use strict';
(function(){

angular.module('appb')
.component('appbUiFooter',{
    templateUrl: 'modules/appb-ui/appb-ui-footer.template.html',  
    bindings: {
      footerData: '='
    },
    controller: ['$scope', 'AppbData',
      function ($scope, AppbData){
        $scope.appData = AppbData.getAppData();

      }
    ]
})



  
//______________________________
})();
