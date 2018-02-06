/**
 * tab条组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('levelBox',{
    templateUrl: 'app-steefac/component/level-box/level-box.template.html',
    bindings: {
      level: '<'
    },
    controller:['$scope', '$element', 'FacSearch', ctrl]
  });


  function ctrl($scope, $element, FacSearch) {
    var ctrl = this;
    this.$onChanges=function(chg){
      ctrl.level = ctrl.level == undefined ? 3 : ctrl.level;
      $scope.text = FacSearch.levelDick[ctrl.level] + '资质';
      $scope.level = ctrl.level;
    }
  }
})(window, angular);