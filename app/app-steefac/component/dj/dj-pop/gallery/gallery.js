!(function (window, angular, undefined) {

  var theModule = angular.module('dj-component');

  theModule.component('djGallery', {
    bindings: {
      imgs: '<',
      active: '<',
      nav: '@',
      btns: '<',
    },
    template: `
      <div class="dj-gallery-box">
        <div class="dj-gallery-list">
          <div class="dj-gallery-item item-{{$index+1-active}}" ng-repeat="img in imgs track by $index" >
            <img class="" ng-src="{{img}}"/>
          </div>
        </div>
        <div class="dj-gallery-nav flex flex-between" ng-if="1">
          <div class="dots flex flex-w1 flex-center" ng-if="1">
            <div ng-click="scrollTo($index)" ng-repeat="img in imgs track by $index">{{$index==active&&'●'||'○'}}</div>
          </div>
          <div class="btns flex flex-center" ng-if="$ctrl.btns.length">
            <div ng-click="clickButton(btn)" ng-repeat="btn in $ctrl.btns track by $index">
              <div class="{{btn.css}}">{{btn.text||''}}</div>
            </div>
          </div>
        </div>
        <div class="dj-gallery-debug" ng-if="debug">
          {{debug}}
        </div>
      </div>
    `,
    controller: ["$scope", "$window", "$element", "$q", "$animateCss", function ($scope, $window, $element, $q, $animateCss) {
      $scope.ZZZ = "DJ_Gallery";

      $scope.active = 0;
      this.$onChanges = (changes) => {
        if (changes.imgs) {
          $scope.imgs = changes.imgs.currentValue || [];
          //console.log('DJ_Gallery imgs=', $scope.imgs);
        }
        if (changes.active) {
          $scope.active = changes.active.currentValue || 0;
        }
      }

      this.$onInit = () => {
        setTimeout(() => {
          Move.init();
          var eleHandleMouse = Move.list;
          eleHandleMouse.addEventListener('mousedown', onTouchstart, true);
          eleHandleMouse.addEventListener('touchstart', onTouchstart, true);
          eleHandleMouse.addEventListener('mousemove', onTouchmove, true);
          eleHandleMouse.addEventListener('touchmove', onTouchmove, true);
          eleHandleMouse.addEventListener('mouseup', onTouchend, true);
          eleHandleMouse.addEventListener('touchend', onTouchend, true);
          scrollTo($scope.active);
        });
      }


      var Move = {
        min: 10, // 超过这个值，表示已滑动，不再是点击了
        fastPx: 5, // 快速滑动系数，越小，表示满足快速滑动的速度越大
        slowTurn: 0.3, // 慢速移动可翻页的比例
        init: function () {
          Move.box = $element[0].querySelector(".dj-gallery-box");
          var w = Move.box.clientWidth;
          //console.log("初始化, w=", w);
          Move.list = $element[0].querySelector(".dj-gallery-list");
          angular.element(Move.list).css("width", (w * $scope.imgs.length) + "px");
          angular.element(Move.list.querySelectorAll(".dj-gallery-item")).css("width", w + "px");
        },
        checkFast: function (timeStamp) {
          // 计算是否快速滑动
          var dt = timeStamp - Move.fast.t;
          var dx = Math.abs(Move.x1 - Move.fast.x);
          if (dx * Move.fastPx < dt) {
            //console.log("不够快！", dx, dt);
            // 不够快，数据复原
            Move.fast = { x: Move.x1, t: timeStamp };
            return false;
          }
          else {
            //console.log("快！", dx, dt);
            return true;
          }
        },
        minMove: function (timeStamp) {
          if (Move.checkFast(timeStamp)) {
            //console.log("快！");
            return Move.box.clientWidth * Move.slowTurn * 0.3;
          }
          return Move.box.clientWidth * Move.slowTurn;
        }
      };

      function onTouchstart(event) {
        Move.touchstart = true;
        //console.log("滚动, 开始");
        event.preventDefault();
        event.stopPropagation();
        Move.begin = true;
        Move.moved = false;
        Move.x0 = Move.x1 = (event.touches && event.touches[0] || event).clientX;
        Move.y0 = Move.y1 = (event.touches && event.touches[0] || event).clientY;
        Move.fast = { x: Move.x1, t: event.timeStamp };
        Move.offsetLeft = parseInt(Move.list.style.left) || 0;

        //$scope.debug = "滚动, 开始" + Move.x1; $scope.$apply();
      }
      function onTouchmove(event) {
        if (!Move.begin) return;
        Move.touchstart = true;
        //console.log("滚动, 移动");
        event.preventDefault();
        event.stopPropagation();
        Move.x1 = (event.touches && event.touches[0] || event).clientX;
        Move.y1 = (event.touches && event.touches[0] || event).clientY;
        Move.list.style.left = (Move.offsetLeft + Move.x1 - Move.x0) + 'px';
        // 是否已移动了
        if (Math.abs(Move.x1 - Move.x0) >= Move.min || Math.abs(Move.y1 - Move.y0) >= Move.min) {
          Move.moved = true;
        }
        Move.checkFast(event.timeStamp);

        //$scope.debug = "滚动, 开始" + Move.x0 + ", 移动:" + Move.x1; $scope.$apply();
      }
      function onTouchend(event) {
        Move.begin = false;
        Move.touchstart = false;
        //console.log("滚动, END");
        event.preventDefault();
        event.stopPropagation();
        var lastLeft = parseInt(Move.list.style.left);
        var dMove = Move.offsetLeft - lastLeft;
        var minMove = Move.minMove(event.timeStamp);
        if (!Move.moved) {
          //console.log("点击");
          $scope.$emit("dj-pop-box-close", { active: $scope.active });
        }
        else if (dMove > minMove) {
          scrollTo($scope.active + 1);
        }
        else if (dMove < -minMove) {
          scrollTo($scope.active - 1);
        }
        else {
          scrollTo($scope.active);
        }
      }

      /** 导航 */
      var scrollTo = $scope.scrollTo = (nth) => {
        Move.init();
        if (nth < 0) nth = 0;
        if (nth >= $scope.imgs.length) nth = $scope.imgs.length - 1;
        $scope.active = nth;

        var animator = $animateCss(angular.element(Move.list), {
          from: { left: Move.list.style.left },
          to: { left: (-nth * Move.box.clientWidth) + 'px' },
          easing: 'ease',
          duration: 0.2 // 0.2秒
        });
        animator.start().then(a => {
          //console.log("动画结束, a = ", a);
          $scope.active = nth;
        }).catch(e => {
          console.log("动画结束, e = ", e);
        });
      }

      /** 功能按钮 */
      $scope.clickButton = function (btn) {
        var result = btn.fn && btn.fn($scope.active);
        if (result) $q.when(result).then(r => {
          if($scope.imgs.length < 1){
            $scope.$emit("dj-pop-box-close", { active: $scope.active });
          }
          scrollTo($scope.active);
        }).catch(e=>{
          console.log("点击, e = ", e);
        })
      };

    }]
  });



})(window, angular);