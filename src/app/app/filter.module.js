

angular.module('appFilters', [])
  
.filter('nr2br', function() {
  return function(input) {
    return input.replace(/\n/ig, "<br/>");
  };
})
  
.filter('nr2arr', function() {
  return function(input) {
    return input.split("\n");
  };
})
.filter('money', function() {
  return function(input) {
    return money(input);
  };
})
.filter('hhmm', function() {
  return function(input) {
    return input && input.substr(0,16) || "";
  };
})
  
.filter('cut', function() {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace != -1) {
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || ' …');
  };

})

;