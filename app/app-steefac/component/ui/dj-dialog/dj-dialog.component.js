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
      templateUrl: 'app-steefac/component/ui/dj-dialog/dj-dialog.template.html',
      scope: {
        dialogShow: '=',
        backClose: '@',
        dlgBody: '@',
        dlgTitle: '@',
        hideCancel: '@',
        hideOk: '@',
        onClose: '&',
        onClickBack: '&'
      },
      controller:['$scope', '$element', '$rootScope', '$q', ctrl]
    };
  });


  function ctrl($scope, $element, $rootScope, $q) {
    $scope.clickBack = function(){
      $scope.onClickBack();
      if($scope.backClose){
        $scope.cancel();
      }
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
    $scope.$on('$locationChangeStart', function(event) {
      //显示时按浏览器的后退按钮：关闭对话框
      if($scope.dialogShow) {
        $scope.cancel();
        event.preventDefault();
      }
    });
  }
})(window, angular);