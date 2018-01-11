'use strict';
(function(){

angular.module('amap-main')
.component('amapMain',{
    template: 'Map Loading...',
    bindings: {
    },
    controller: ['$scope', '$element','AmapMainData', 'FacMap',
      function ($scope, $element, AmapMainData, FacMap){
        FacMap.clearAllMark();
        AmapMainData.showMapTo($element[0]);
      }
    ]
})

})();
