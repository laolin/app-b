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
          /*
          ctrl.galleryData.onTouchStart=function(obj,ev) {
            $log.log('sw.onTouchStart',obj,ev);
          }
          ctrl.galleryData.onTouchEnd=function(obj,ev) {
            $log.log('sw.onTouchEnd',obj,ev);
          }
          ctrl.galleryData.onClick=function(obj,ev) {
            $log.log('sw.onClick',obj,ev);
          }
          */
          ctrl.galleryData.onTap=function(obj,ev) {
            //$log.log('sw.onTap',obj,ev);
          }
          ctrl.galleryData.onDoubleTap=function(obj,ev) {
            //$log.log('sw.onDoubleTap',obj,ev);
          }
          
          ctrl.galleryData.onNav=function(obj) {
            //$log.log('sw.onSlideChangeEnd',obj);
            ctrl.galleryData.headerData.title=
              (1+obj.activeIndex) + '/' + obj.slides.length;
            ctrl.galleryData.active=obj.activeIndex;
            $scope.$apply();
          };
          $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            //显示 gallery 时按浏览器的后退按钮：关闭 gallery
            if(ctrl.galleryData.show) {
              ctrl.close();
              event.preventDefault();
            }
          });
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
