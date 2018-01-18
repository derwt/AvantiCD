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

app.directive('titleContent', function() {
  return {
    restrict: 'E',
    scope: {
      title: '@title',
      content: '='
    },
    template: '<div class="text-center"> <h4>{{ title }}</h4> <p class="black-text">{{ content }}</p> </div>',
    link: (scope,elem,attrs) => {}
  };
});
