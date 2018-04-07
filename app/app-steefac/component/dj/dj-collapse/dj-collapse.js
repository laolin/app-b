/**
 * collapse 属性指令
 * ver: 0.0.1
 * build: 2018-02-10
 * power by LJH.
 */
!(function (window, angular, undefined) {

  var djCollapseId = 1;

  angular.module('dj-component')
    .directive('djCollapse', ["$rootScope", "$parse", "$timeout", function ($rootScope, $parse, $timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          element.djCollapseId = djCollapseId++;
          //console.log("collapse link");
          attr.$observe("djCollapse", showHide);
          attr.$observe("group", setGroup);
          scope.$on("dj-collapse-open-broadcast", onOpenBroadcast)

          function showHide(value) {
            value = value || "0";
            value = scope.$eval(value);
            $timeout(function () {
              element[0].style.height = value ? element[0].scrollHeight + "px" : "0";
              if (value) {
                //console.log("打开 = ", element.djCollapseId);
                $rootScope.$broadcast("dj-collapse-open-broadcast", { element });
              }
            })
          }
          function setGroup(value) {
            element.djCollapseGroup = value;
          }
          function onOpenBroadcast(event, data) {
            //console.log("消息, ", element.djCollapseId, element);
            if (element == data.element) return;
            if (element.djCollapseGroup && element.djCollapseGroup !== data.element.djCollapseGroup) return;

            var handle = $parse(attr.djCollapseGroup);
            scope.$apply(function(){handle(scope, { element })} );
          }
        }
      };
    }]);


})(window, angular);