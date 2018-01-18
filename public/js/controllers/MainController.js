angular.module('MainController', []).controller('MainController', ['$scope', function($scope) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers =
  [
    {
      cid: 2349,
      phone: [6506782766, 6504008921],
      city: "BL",
      address: "612  Southview Court",
      cross: "South Road",
      note: "Michael the pizza face. Is cool!",
      ordered: 1511741627
    },
    {
      cid: 2349,
      phone: [6506782766],
      city: "BL",
      address: "612  Southview Court",
      cross: "South Road",
      note: "Michael the pizza face. Is Not Cool!",
      ordered: 1511741627
    }
  ];
  // $scope.addCustomer = () => { $scope.customers.push()}
}]);
