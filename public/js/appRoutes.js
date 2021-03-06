angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    .when("/", {
      templateUrl: 'views/home',
      controller: 'CustomerController'
    })
    .when("/nerds", {
      templateUrl: 'views/nerd',
      controller: 'NerdController'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

}]);
