!(function (angular, window, undefined) {

  angular.module('dj-component').component('textIcon', {
    template: `
        <div class="flex-v flex-center flex-v-center" ng-style="{color:$ctrl.color}">
          <i class="fa fa-{{$ctrl.fa}}"></i>
          <div ng-style="{color:$ctrl.textColor}">{{$ctrl.text}}</div>
        </div>
      `,
    bindings: {
      fa: "@",
      text: "@",
      color: "@"
    },
    controller: ['$scope', ctrl]
  })

  function ctrl($scope) {

  }

})(angular, window);