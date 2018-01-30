/**
 * 对话框工厂
 * 支持快捷 js 弹出对话框，支持 alert, confirm, modal(自定义确定框)
 * 弹框后，返回承诺，确认和取消按钮，分别对应解决和拒绝承诺
 */
!(function(angular, window, undefined){

  angular.module('steefac')
  .directive('djDialogQuick', function(){
    return {
      restrict: 'AE',
      template: `
        <dj-dialog
          back-close="{{backClose}}"
          dlg-body="{{dlgBody}}"
          dlg-title="{{dlgTitle}}"
          on-close="onClose($name)"
          hide-cancel="{{hideCancel}}"
          hide-ok="{{hideOk}}"
          dialog-show="dialogShow">
        </dj-dialog>
      `,
      scope: {
        backClose: '@',
        hideOk: '@',
        hideCancel: '@',
        dlgBody: '@',
        dlgTitle: '@'
      },
      controller:['$scope', ($scope)=>{
        $scope.dialogShow = true;
        $scope.onClose = function(name){
          $scope.$emit("dj-dialog-quick-close", name);
        };
      }]
    };
  });



angular.module('steefac')
.factory('DjDialog', ['$rootScope', '$rootScope', '$compile', 'DjWaiteReady', DjDialog]);


function DjDialog($rootScope, $rootScope, $compile, DjWaiteReady){

  /**
   * 初始化对话框数据，并返回完整参数
   * @param {*} content 
   * @param {*} title 
   * @param {*} options 
   */
  function initData(content, title, options){
    if(typeof content == 'object'){
      options = content;
    }
    else {
      if(typeof title == 'object'){
        options = title;
      }
      else{
        options = options || {};
        options.title = title;
      }
      options.content = content;
    }

    options.title = options.title || 'CMOSS 对话框';
    options.backClose = options.backClose && 1 || '';
    return options;
  }


  /**
   * 显示对话框，并返回承诺
   * @param {*} options 
   */
  function showDialog(options) {
    var waiteDialog = new DjWaiteReady();
    var element = options.element || document.body;
    scope = options.scope || $rootScope;
    var dlg = $compile(dialogTemplate(options))(scope);
    element.append(dlg[0]);
    var listener = scope.$on("dj-dialog-quick-close", function(event, data){
      listener(); listener = null;
      dlg.remove();
      dlg = null;
      waiteDialog[data!=='OK'?'reject':'resolve'](data);
    });
    return waiteDialog.ready();
  }


  /**
   * 根据参数，生成对话框模板
   * @param {*} options 
   */
  function dialogTemplate(options) {
    return `
      <dj-dialog-quick
        back-close="${options.backClose&&1||''}"
        dlg-title="${options.title}"
        dlg-body="${options.body}"
        hide-ok="${options.hideOk&&1||''}"
        hide-cancel="${options.hideCancel&&1||''}"
      ></dj-dialog-quick>`;
  }

  /**
   * 弹框
   * @param {*} content 
   * @param {*} title 
   * @param {*} options 
   */
  function alert(content, title, options){
    options = initData(content, title, options);
    options.backClose = false;
    options.hideCancel = true;
    return showDialog(options);
  }

  /**
   * 确认框
   * @param {*} content 
   * @param {*} title 
   * @param {*} options 
   */
  function confirm(content, title, options){
    options = initData(content, title, options);
    options.backClose = false;
    return showDialog(options);
  }

  /**
   * 非模式对话框
   * @param {*} content 
   * @param {*} title 
   * @param {*} options 
   */
  function modal(content, title, options){
    options = initData(content, title, options);
    // options.backClose = true;
    return showDialog(options);
  }


  /**
   * 暴露函数
   */
  return {
    alert   : alert,
    confirm : confirm,
    modal   : modal
  };

};

})(angular, window);
