angular.module('MainController', []).controller('MainController', ['$scope', function($scope) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers =
  [
    {
      cid: 2349,
      phone: [6506782755, 6504008921, 4539990000],
      city: "BL",
      address: "612  Southview Court",
      cross: "South Road",
      note: "Michael the pizza face. Is cool!",
      ordered: 1511741627
    },
    {
      cid: 3065,
      phone: [6504008921, 6505954446],
      city: "BL",
      address: "2040 Ralston Avenue",
      cross: "Alameda",
      note: "Michael the pizza face. Is Not Cool!",
      ordered: 1464389861
    }
  ];
  // $scope.addCustomer = () => { $scope.customers.push()}

  let phoneInputReady = (input) => { return input.length == 10; }

  let phoneInput = $('#phoneInput');
  $(phoneInput).on('input',function(e){
    if (!phoneInputReady(phoneInput.val())) return;

      console.log(phoneInput.val());
  });

}]);
