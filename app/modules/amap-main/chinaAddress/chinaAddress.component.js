/* 省市区选择组件 */
!(function(){'use strict';
  angular.module('amap-main')
  .directive('chinaAddress', function(){
    return {
      restrict: 'AE',
      templateUrl: 'modules/amap-main/chinaAddress/chinaAddress.template.html',
      scope: {
        address: "@",
        resolve: '=',
        close: '&',
        dismiss: '&'
      },
      controller: ['$scope', '$timeout', '$element', 'AmapMainData', dlgCtrl]
    }
  });
  function dlgCtrl($scope, $timeout, $element, AmapMainData) {
    var china = $scope.china = china_allarea;

    $scope.$watch('address', function (vNew) {
      //console.log('省市区选择组件, address=', vNew);
      D.setData(vNew || '');
    });


    /**
     * 界面、事件参数
     */
    var E = {
      itemHeight: 45
    }
    $timeout(()=>{
      let scrollHeight = $element.find(".list-box").height();
      let scrollWidth  = $element.find(".list-box").width();
      $element.find(".list-abc").css({
        padding:((scrollHeight - E.itemHeight)/2)+'px 2px',
        //width: (scrollWidth/3 -5) + "px"
      });
      $element.find(".high-light-box").css({
        top:((scrollHeight - E.itemHeight)/2 - 5)+'px',
        height: (E.itemHeight + 10) + 'px'
        //width: (scrollWidth/3 -5) + "px"
      });
    }, 16);



    //console.log($scope.resolve);
    var D = $scope.D = {
      listA: [],
      listB: [],
      listC: [],

      activeA: 0,
      activeB: 0,
      activeC: 0,

      movingA: 0,
      movingB: 0,
      movingC: 0,

      pauseEvent: false,

      setData: function(address){
        D.pauseEvent = true;
        var abc = address && address.split(' ') || [];
        D.activeA = D.movingA =
        D.activeB = D.movingB =
        D.activeC = D.movingC = 0;
        AmapMainData.china.getAllCity().then(china => {
          D.listA = AmapMainData.china.getSubCity('');
          D.activeA = D.movingA = D.listA.indexOf(abc[0]); if(D.activeA < 0) D.activeA = D.movingA = 0;
          D.listB = AmapMainData.china.getSubCity([D.listA[D.activeA]]);
          D.activeB = D.movingB = D.listB.indexOf(abc[1]); if(D.activeB < 0) D.activeB = D.movingB = 0;
          D.listC = AmapMainData.china.getSubCity([D.listA[D.activeA], D.listB[D.activeB]]);
          D.activeC = D.movingC = D.listC.indexOf(abc[2]); if(D.activeC < 0) D.activeC = D.movingC = 0;
          $timeout(()=>{
            D.pauseEvent = false;
            D.timerChangeA(D.scrollTopA = D.activeA * E.itemHeight);
            D.timerChangeB(D.scrollTopB = D.activeB * E.itemHeight);
            D.timerChangeC(D.scrollTopC = D.activeC * E.itemHeight);
          }, 320);
        })
      },
      getData: function(){
        var s = D.listA[D.activeA];
        if(D.listB[D.activeB]){
          s += " " + D.listB[D.activeB];
          if(D.listC[D.activeC]){
            s += " " + D.listC[D.activeC];
          }
        }
        return s;
      },
      changeA: function (pos, event) {
        //console.log("A,", pos, event)
        if(D.pauseEvent) return;
        D.scrollTopA = pos;
        D.movingA = Math.round(pos / E.itemHeight);
        D.clearTimer();
        $timeout(D.timerChangeA, 300);
      },
      changeB: function (pos, event) {
        //console.log("B,", pos, event)
        if(D.pauseEvent) return;
        D.scrollTopB = pos;
        D.movingB = Math.round(pos / E.itemHeight);
        D.clearTimer();
        $timeout(D.timerChangeB, 300);
      },
      changeC: function (pos, event) {
        //console.log("C,", pos, event)
        if(D.pauseEvent) return;
        D.scrollTopC = pos;
        D.activeC = Math.round(pos / E.itemHeight);
        D.clearTimer();
        $timeout(D.timerChangeC, 300);
      },

      clearTimer: function(){
        D.timer && $timeout.cancel( D.timer );
      },
      timerChangeA: function (pos) {
        D.scrollTopA = D.movingA * E.itemHeight;
        if(D.activeA == D.movingA){
          return;
        }
        D.activeA = D.movingA;
        D.listB = AmapMainData.china.getSubCity(D.listA[D.activeA]);
        D.scrollTopB = 0;
        D.activeB = D.movingB = 0;
        D.listC = AmapMainData.china.getSubCity([D.listA[D.activeA], D.listB[D.activeB]]);
        D.scrollTopC = 0;
        D.activeC = D.movingC = 0;
      },
      timerChangeB: function (pos) {
        D.scrollTopB = D.movingB * E.itemHeight;
        if(D.activeB == D.movingB){
          return;
        }
        D.activeB = D.movingB;
        D.listC = AmapMainData.china.getSubCity([D.listA[D.activeA], D.listB[D.activeB]]);
        D.scrollTopC = 0;
        D.activeC = D.movingC = 0;
      },
      timerChangeC: function (pos) {
        D.scrollTopC = D.activeC * E.itemHeight;
      }

    };


    //console.log($scope.resolve);
    $scope.ok = function () {
      $scope.close && $scope.close({$value: D.getData()});
    };

    $scope.cancel = function () {
      $scope.dismiss({$value: 'cancel'});
    };
  }


  var china_allarea = [];

})();