'use strict';
(function(){

angular.module('appb')
.component('appbUiGallery',{
    templateUrl: 'modules/appb-ui/appb-ui-gallery.component.template.html',  
    bindings: { 
     appData:"<",
     galleryData:"="
    },
    controller: ['$scope','$log','$timeout',
      function ($scope,$log,$timeout){
        var ctrl=this;
        ctrl.swiper=false;
        ctrl.$onInit=function() {
          $log.log('appbUiGallery=====',ctrl.appData,ctrl.imgs);
          $timeout(function(){
            ctrl.swiper = new Swiper('.swiper-container', {
              pagination: '.swiper-pagination',
              paginationClickable: true
            });
            appData.swiper=ctrl.swiper;
          },10);
        }
        ctrl.close=function() {
          ctrl.galleryData.show=false;
        }
        
        
      }
    ]
})


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
