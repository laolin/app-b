/**
 * 对话框组件
 * ver: 0.0.1
 * build: 2018-01-25
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .directive('djDialog', function(){
    return {
      restrict: 'AE',
      transclude:  {
        'title': '?djDialogTitle',
        'body': '?djDialogBody',
        'footer': '?djDialogFooter'
      },
      templateUrl: 'app-steefac/component/dj-dialog/dj-dialog.template.html',
      scope: {
        dialogShow: '=',
        backClose: '@',
        dlgBody: '@',
        dlgTitle: '@',
        onClose: '&'
      },
      controller:['$scope', '$element', '$rootScope', '$q', ctrl]
    };
  });


  function ctrl($scope, $element, $rootScope, $q) {
    $scope.clickBack = function(){
      if(!$scope.backClose) $scope.dialogShow = false;
    };
    $scope.OK = function(){
      if($scope.onClose){
        $q.when($scope.onClose({$name: 'OK'})).then( r =>{
          $scope.dialogShow = r !== undefined && !r;
        });
      }
      else{
        $scope.dialogShow = false;
      }
    };
    $scope.cancel = function(){
      if($scope.onClose){
        $q.when($scope.onClose({$name: 'cancel'})).then( r =>{
          $scope.dialogShow = r !== undefined && !r;
        });
      }
      else{
        $scope.dialogShow = false;
      }
    };
  }
})(window, angular);