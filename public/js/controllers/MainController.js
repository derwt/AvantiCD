angular.module('MainController', []).controller('MainController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers = [];
  $scope.newCustomer = {
    phone: "",
    city: "",
    address: "",
    cross: "",
    note: ""
  };
  $scope.cities = ["BL", "SC", "SM", "RWS", "RWC", "FC", "HB"];
  $scope.cityColors = ["green", "orange", "cyan", "amber", "red", "purple", "black"];
  $scope.cityButtonStates =[false, false, false, false, false, false, false];

  $scope.getCityColorByIndex = (index) => { return $scope.cityColors[index]; }
  let getCityColorByName = (name) => { return $scope.cities.indexOf(name); }

  $scope.select = (idCard) => {
    $scope.selected = idCard;

    // TODO: Update call to UI
  }

  $scope.isSelected = (idCard) => {
    return $scope.selected === idCard;
  }

  let getDigits        = () => { return phoneInput.val(); }
  let digitsLength     = () => { return getDigits().length; }
  let phoneInputReady  = () => { return digitsLength() == 10; }

  let createContainer  = $('.create-container');
  let hidingRegistration = false;
  let hideRegistration = () => {
    hidingRegistration = true;
    if (!createContainer.hasClass('fadeOut')) createContainer.addClass('fadeOut').on(
      'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', (error) => {
        if (hidingRegistration) createContainer.addClass('hidden');
    });
  }
  let showRegistration = () => {
    hidingRegistration = false;
    if (createContainer.hasClass('hidden')) createContainer.removeClass('hidden');
    if (createContainer.hasClass('fadeOut')) createContainer.removeClass('fadeOut');
  }

  let numberOfCustomers = () => { return $scope.customers.length; }

  let phoneInput = $('#phoneInput');
  $(phoneInput).on('input', (e) => {
    if (!phoneInputReady(getDigits())) {

      if (digitsLength() == 0) showRegistration();
      else if (digitsLength() == 9 && numberOfCustomers() != 0) {

        // Clear ID Cards after fading them out
        $('id-card').toggleClass('fadeOutRight').on(
          'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', (error) => {
            $scope.customers.splice(0, numberOfCustomers());
            $scope.$apply();
          });

      } else hideRegistration();

      return;
    }

    $http.get('http://localhost:27017/customers/' + phoneInput.val())
      .then((response) => {

        $scope.customers = response.data.slice();

        if (numberOfCustomers() == 0) showRegistration();
        else hideRegistration();

      });

  });

  $scope.selectCity = (position, cityButtons) => {
    $scope.newCustomer.city = cityButtons[position];
    angular.forEach(cityButtons, (button, index) => {
      $scope.cityButtonStates[index] = (position == index);
    });
  }

  let getAddress = () => { return $('#addressInput').val(); }
  let getCross = () => { return $('#crossInput').val(); }
  let getNote = () => { return $('#noteInput').val(); }

  let prepareCustomer = () => {
    $scope.newCustomer.phone = getDigits();
    $scope.newCustomer.address = getAddress();
    $scope.newCustomer.cross = getCross();
    $scope.newCustomer.note = getNote();
  }

  $scope.createCustomer = () => {

    prepareCustomer();

    $http.post('http://localhost:27017/customers/', $scope.newCustomer)
      .then((response) => {

        hideRegistration();
        // TODO: Update UI with new customer information
        $http.get('http://localhost:27017/customers/' + phoneInput.val())
          .then((response) => {
            $scope.customers = response.data.slice();
          });

      }, (response) => {

        console.log(response.data.errors);

      });


  }



}]);
