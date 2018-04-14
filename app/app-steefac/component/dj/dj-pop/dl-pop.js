!(function (window, angular, undefined) {

  var theModule = angular.module('dj-component');

  theModule.component('djComponentHost', {
    bindings: {
      component: '@',
      param: '<',
    },
    controller: ["$scope", "$element", "$compile", function ($scope, $element, $compile) {
      $scope.ZZZ = "DJ_POP";
      this.$onChanges = (changes) => {
        if (changes.component && changes.param) {
          compile(changes.component.currentValue, changes.param.currentValue);
          return;
        }
        if (changes.component) {
          compile(changes.component.currentValue, this.param);
          return;
        }
        if (changes.param) {
          compile(this.component, changes.param.currentValue);
          return;
        }
      }
      function compile(name, param) {
        if (!name || !param) {
          $element.html("");
          return;
        }
        var sBinds = "";
        for (var k in param) {
          $scope[k] = param[k];
          sBinds += ` ${k}="${k}"`
        }
        $element.html(`<div class="dj-pop-box"><${name} ${sBinds}></${name}></div>`);
        $compile($element.contents())($scope);
      };
    }]
  });


  /** 仅供 DjPop 调用 */
  theModule.component('djPopBox', {
    bindings: {
      component: '@'
    },
    template: `<dj-component-host param="param || options.param" component="{{$ctrl.component}}"></dj-component-host>`
  });

  theModule.factory("DjPop", ["$compile", "$rootScope", "DjWaiteReady", "$animateCss", function ($compile, $rootScope, DjWaiteReady, $animateCss) {
    /**
     * 显示功能
     * @param {string} component
     * @param {object} options
     * @param {function|false} options.beforeClose: 将要关闭，返回 false, 或 reject, 不可关闭
     * @param {function|false} options.onClose: 关闭时回调
     */
    function show(component, options) {
      options = options || {};
      var waiteDialog = new DjWaiteReady();
      var element = options.element || document.body;
      var scopeParent = options.scope || $rootScope;
      var dlg = $compile(`<dj-pop-box component="${component}"></dj-pop-box>`)(scopeParent);
      element.append(dlg[0]);
      var scopeDjPop = dlg.children().scope();
      scopeDjPop.options = options;
      var listener = scopeDjPop.$on("dj-pop-box-close", function (event, data) {
        event.preventDefault();
        closeDjg(data);
      });
      //显示时按浏览器的后退按钮：关闭对话框
      var listener2 = scopeDjPop.$on("$locationChangeStart", function (event) {
        event.preventDefault();
        closeDjg("locationChange");
      });
      return waiteDialog.ready();

      function closeDjg(data) {
        setTimeout(() => {
          scopeDjPop.$destroy();
          dlg && dlg.remove();
          dlg = null;
        })
        //console.log('对话框关闭', data);
        waiteDialog.resolve(data);
      }
    }

    function gallery(options) {
      return show("dj-gallery", options);
    }

    return {
      show,
      gallery,
    }
  }])


})(window, angular);