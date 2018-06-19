
angular.module('dj.all.moudles', [
  'dj-service',
  'dj-view',
  'dj-component',
]);


angular.module('dj-service', [
  'wx-login',
  'dj-localStorage-table',
  'dj-http',
]);


angular.module('dj-view', [
]);


angular.module('dj-component', [
  'dj-form',
  'dj-ui',
  'dj-pop',
  'ngAnimate',
  'ui.uploader'
]);
