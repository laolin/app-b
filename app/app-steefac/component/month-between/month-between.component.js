/**
 * 月份到月份选择组件
 * ver: 0.0.1
 * build: 2017-12-20
 * power by LJH.
 */
!(function (window, angular, undefined){
  'use strict';

  angular.module('steefac')
  .component('monthBetween',{
    templateUrl: 'app-steefac/component/month-between/month-between.template.html',
    bindings: {
      ngModel: '='
    },
    controller:['$scope', '$element', ctrl]
  });


  function ctrl($scope, $element) {
    var $ctrl = this;
    var sep = '.',
        data = {
          b: 0,
          e: 0,
          n: 0
        };
    $scope.b = $scope.e = "";
    $scope.$watch("ngModel.from", init);
    $scope.$watch("ngModel.to", init);
    function init(){
      var ngModel = $ctrl.ngModel || {};
      if(ngModel.from == $scope.b &&
         ngModel.to   == $scope.e &&
         $scope.b && $scope.e) return;
      data.b = str2be(ngModel.from );
      data.e = str2be(ngModel.to   );
      if(!data.b){
        var date = new Date();
        data.b = date.getFullYear() * 12 + date.getMonth();
      }
      if(!data.e){
        data.e = data.b + 0; // 默认1个月
      }
      $scope.b = be2str(data.b);
      $scope.e = be2str(data.e);
      $scope.n = data.e - data.b + 1;
      console.log('111')
    };

    /**
     * 字串转月数
     */
    function str2be(str){
      if(!str) return 0;
      var s = str.split(sep);
      return s[0]*12 + +s[1] - 1;
    }
    /**
     * 月数转字串
     */
    function be2str(n){
      return Math.floor(n/12) + sep + (n%12 + 101 + "").substr(1,2);
    }


    /**
     * 开始选择
     */
    $scope.picking = false;
    $scope.months = [1,2,3,4,5,6,7,8,9,10, 11, 12];
    $scope.pick = function(){
      $scope.picking = {};
      $scope.firstYear = Math.floor(data.b/12) - 1;
      $scope.lastYear = Math.floor(data.e/12) + 1;
      $scope.years = [];
      for(var i = $scope.firstYear ; i<= $scope.lastYear; i++)$scope.years.push(i);
      console.log("选吧");
    }
    $scope.cssMonth = function(month){
      var b = $scope.picking.b || data.b;
      var e = $scope.picking.e || data.e;
      return (month >= b && month <= e? "y":"")
       + (month <b ? " last":"")
       + (month%4 == 0 ? ' left' : '')
       + (month%4 == 3 ? ' right' : '')
       + (month == b ? ' b' : '')
       + (month == e ? ' e' : '');
    }
    /**
     * 事件响应
     */
    $scope.clickMonth = function(year, month){
      month = year * 12 + month - 1;
      var b = $scope.picking.b || data.b;
      var e = $scope.picking.e || data.e;
      if(month < b){
        $scope.picking.b = month;
      }
      else if(month > e){
        $scope.picking.e = month;
      }
      else if(!$scope.picking.b){
        $scope.picking.b = month;
      }
      else{
        $scope.picking.e = month
      }
      if($scope.picking.b && $scope.picking.e){
        $scope.ok();
      }
    }
    $scope.ok = function(){
      $ctrl.ngModel.from = $scope.b = be2str(data.b = $scope.picking.b||data.b);
      $ctrl.ngModel.to   = $scope.e = be2str(data.e = $scope.picking.e||data.e);
      $ctrl.ngModel.n    = $scope.n = data.e - data.b + 1;
      $scope.picking = false;
    }
    $scope.cancel = function(){
      $scope.picking = false;
    }
  }
})(window, angular);