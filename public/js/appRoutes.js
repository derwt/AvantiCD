angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

  $routeProvider
         .when("/", {
           templateUrl: 'views/home',
           controller: 'MainController'
       })
       .when("/nerds", {
         templateUrl: 'views/nerd',
         controller: 'NerdController'
     });

  $locationProvider.html5Mode(true);

}]);
