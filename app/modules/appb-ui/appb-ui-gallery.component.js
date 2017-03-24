'use strict';
(function(){

angular.module('appb')
.component('appbUiGallery',{
    templateUrl: 'modules/appb-ui/appb-ui-gallery.component.template.html',  
    bindings: { 
     appData:"<",
     galleryData:"<"
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.swiper=false;
        ctrl.$onInit=function() {
        }
        ctrl.$onChanges=function(chg) {
        }
        ctrl.close=function() {
          ctrl.galleryData.show=false;
        }
        
        
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
