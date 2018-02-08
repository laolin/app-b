/* html组件 */
!(function(){
  angular.module('steefac')
  .directive('htmlContent', function(){
    return {
      restrict: 'AE',
      scope: {
        htmlContent: "=?"
      },
      controller: ['$scope', '$element', '$compile', ctrl]
    }
  });

  function ctrl($scope, $element, $compile) {
    $scope.$watch("htmlContent", function(vNew){
      $element.html(vNew.split("\n").join("<br>"));
      $compile($element.contents())($scope);
    });
  }

})();
