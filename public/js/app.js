let app = angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainController', 'NerdController', 'CustomerService']);

app.directive('idCard', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/id-card.html'
  };
});
