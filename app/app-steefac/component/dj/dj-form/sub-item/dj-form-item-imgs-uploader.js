/**
 * 动态表单-图片上传组件
 * ver: 0.0.1
 * build: 2018-02-25
 * power by LJH.
 */
!(function (window, angular, undefined) {


  angular.module('dj-form')
    .component('djFormItemImgsUploader', {
      bindings: {
        configs: '<',
        djDirty: '<',
        djValid: '<',
        invalidText: '<',
        djRequire: '<',
        initValue: '<',
        onChange: '&'
      },
      template: `
          <div class="flex prompt-top">
            <div class="flex title">
              <div class="require">{{$ctrl.djRequire && '*' || ''}}</div>
              <div class="">{{$ctrl.configs.title}}</div>
            </div>
            <div class="prompt error" ng-if="!$ctrl.djValid">{{$ctrl.invalidText || '请上传图片'}}</div>
          </div>
          <imgs-uploader class="padding-v-1"
            imgs="initValue"
            update-img="onChange(imgs)"
          ></imgs-uploader>
        `,
      controller: ['$scope', ctrl]
    });

  function ctrl($scope) {
    $scope.initValue = [];
    this.$onChanges = (changes) => {
      if(changes.initValue){
        var initValue = changes.initValue.currentValue || [];
        if(!angular.isArray(initValue))initValue = [];
        $scope.initValue = initValue;
      }
    }
    $scope.onChange = (imgs)=>{
      this.onChange({value: imgs});
    }
  }
})(window, angular);