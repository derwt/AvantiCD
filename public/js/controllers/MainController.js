angular.module('MainController', []).controller('MainController', ['$scope', '$http', '$routeParams' ,function($scope, $http, $routeParams) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers =
  [
    // {
    //   cid: 2349,
    //   phone: [6506782755, 6504008921, 4539990000],
    //   city: "BL",
    //   address: "612  Southview Court",
    //   cross: "South Road",
    //   note: "Michael the pizza face. Is cool!",
    //   ordered: 1511741627
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "SC",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "SM",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "RWS",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "RWC",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "FC",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // },
    // {
    //   cid: 3065,
    //   phone: [6504008921, 6505954446],
    //   city: "HB",
    //   address: "2040 Ralston Avenue",
    //   cross: "Alameda",
    //   note: "Michael the pizza face. Is Not Cool!",
    //   ordered: 1464389861
    // }
  ];

  $scope.select = (idCard) => {
    $scope.selected = idCard;

    // TODO: Update call to UI
  }

  $scope.isSelected = (idCard) => {
    return $scope.selected === idCard;
  }

  let phoneInputReady = (input) => { return input.length == 10; }
  let getDigits = () => { return phoneInput.val(); }
  let createContainer = $('.create-container');
  let hideRegistration = () => {
    if (!createContainer.hasClass('hidden')) createContainer.addClass('hidden');
  }
  let showRegistration = () => {
    if (createContainer.hasClass('hidden')) createContainer.removeClass('hidden');
  }

  let phoneInput = $('#phoneInput');
$(phoneInput).on('input', (e) => {
      if (!phoneInputReady(getDigits())) {

        if (getDigits().length == 0) showRegistration();
        else if (getDigits().length == 9 && $scope.customers.length != 0) {

          // Clear ID Cards after fading them out
          $('id-card').toggleClass('fadeOutRight').on(
            'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', (error) => {
              $scope.customers.splice(0, $scope.customers.length);
              $scope.$apply();
            });

        } else hideRegistration();

        return;
      }

      $http.get('http://localhost:27017/customers/' + phoneInput.val())
        .then((response) => {

          $scope.customers = response.data.slice();

          if ($scope.customers.length == 0) showRegistration();
          else hideRegistration();

        });

  });

}]);
