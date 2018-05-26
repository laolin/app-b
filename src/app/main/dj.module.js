
angular.module('dj-view', [
  'ui.router',
  'ui.router.state.events', // 已覆盖 'ui.router'
  'ngAnimate',
]);

angular.module('dj-component', [
  'wx-jssdk',
  'dj-form',
  'dj-pop',
  'dj-ui',
]);

angular.module('dj-service', [
  'dj-http',
  'dj-localStorage-table',
]);

angular.module('dj-filter', [
]);

