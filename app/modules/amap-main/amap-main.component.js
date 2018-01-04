'use strict';
(function(){

angular.module('amap-main')
.component('amapMain',{
    template: 'Map Loading...',
    bindings: {
    },
    controller: ['$scope', '$element','AmapMainData', 'FacMap',
      function ($scope, $element, AmapMainData, FacMap){
        console.log("隐藏所有地图标志！");
        for(var i = FacMap.searchMarkers.length - 1; i>=0; i--) {
          FacMap.searchMarkers[i].hide();
        }
        AmapMainData.showMapTo($element[0]);
      }
    ]
})

})();
