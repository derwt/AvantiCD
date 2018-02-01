angular.module('CustomerController', []).controller('CustomerController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

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
  $scope.errors = [];

  let semicolon = 186;
  let comma = 188;
  let enter = 13;

  // md-chips settings
  const self = this;
  $scope.chips = {
    readonly: false,
    removable: true,
    keys: [enter, comma, semicolon]
  };

  $scope.getCityColorByIndex = (index) => { return $scope.cityColors[index]; }
  $scope.getCityIndexByName = (name) => { return $scope.cities.indexOf(name); }

  const map = $('#map');
  const Avanti = 'Avanti+Pizza,Belmont+CA+USA';
  const mapTemplate = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBX8d3MNFqAY2PIqx4Y7OFc54TNS-ej6jg&" +
    "origin="+Avanti+"&destination=";

  let setMapDestination = (destination) => {
      map[0].src = mapTemplate + destination;
  }
  let getMapDestination = () => {
    if (map[0] !== undefined) return (map[0].src.match(/destination=(.*)/)[1]);
  }

  $scope.select = (idCard) => {
    $scope.selected = idCard;

    // TODO: Update call to UI
    setMapDestination(idCard.address);
    showContainer(editContainer, hidingEditContainer);

  }

  $scope.isSelected = (idCard) => {
    return $scope.selected === idCard;
  }

  $scope.validateChip = ($chip, type) => {
    switch (type) {
      case 'phone':
        if (!(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/).test($chip)) return null;
        break;
    }
  }

  let getSearchValue        = () => { return searchInput.val(); }
  let digitsLength     = () => { return getSearchValue().length; }
  let searchInputReady  = () => { return digitsLength() == 10; }

  let searchContainer = $('#searchContainer');
  let createContainer  = $('#createContainer');
  let editContainer = $('#editContainer');

  let hidingSearchContainer, hidingRegistration, hidingEditContainer = false;
  let currentContainer, currentHiding = null;
  
  let setCurrent = (container, hiding) => {
    currentContainer = container;
    currentHiding = hiding;
  }

  function showContainer(container, hiding) {

    hiding = false;
    hidingSearchContainer = true;
    setCurrent(container, hiding);
    container.removeClass('fadeOutRight');
    if (!searchContainer.hasClass('fadeOutLeft')) searchContainer.addClass('fadeOutLeft').one(
      'animationend', (error) => {
        if (hidingSearchContainer) searchContainer.addClass('hidden');
    });
    setTimeout(() => {
      if (container.hasClass('hidden')) container.removeClass('hidden');
      if (container.hasClass('fadeOutLeft')) container.removeClass('fadeOutLeft');
    }, 800);

  }

  function hideContainer(container, hiding) {

    hiding = true;
    setCurrent(null, hiding);
    hidingSearchContainer = false;
    if (searchContainer.hasClass('fadeOutRight')) searchContainer.removeClass('fadeOutRight');
    if (!container.hasClass('fadeOutRight')) container.addClass('fadeOutRight').one(
      'animationend', (error) => {
        if (hiding) container.addClass('hidden');
  });
    setTimeout(() => {
      if (searchContainer.hasClass('hidden')) searchContainer.removeClass('hidden');
      if (searchContainer.hasClass('fadeOutLeft')) searchContainer.removeClass('fadeOutLeft');
      if (!searchContainer.hasClass('fadeInLeft')) searchContainer.addClass('fadeInLeft');
    }, 800);
  }

  $scope.hideContainer = function() {
    hideContainer(currentContainer, currentHiding);
  }
  // showContainer(createContainer, hidingRegistration);

  let numberOfCustomers = () => { return $scope.customers.length; }

  let searchInput = $('#searchInput');
  $(searchInput).on('input', (e) => {
    if (!searchInputReady(getSearchValue())) {

      if (digitsLength() == 0) return; // TODO: Show something cute about searching for customers
      else if (digitsLength() == 9 && numberOfCustomers() != 0) {

        // Clear ID Cards after fading them out
        $('id-card').toggleClass('fadeOutRight').on(
          'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', (error) => {
            $scope.customers.splice(0, numberOfCustomers());
            $scope.$apply();
          });

      } else {
        // hideContainer(createContainer, hidingRegistration);
        // hideContainer(editContainer, hidingEditContainer);
      }
      return;
    }

    $http.get('http://localhost:27017/customers/' + searchInput.val())
      .then((response) => {

        if (getMapDestination() != Avanti) setMapDestination(Avanti);
        $scope.customers = response.data.slice();

        if (numberOfCustomers() == 0) showContainer(createContainer, hidingRegistration);
        else if (numberOfCustomers() == 1) $scope.select($scope.customers[0]);
        else {
          hideContainer(createContainer, hidingRegistration);
        }
      });

  });

  $scope.selectCity = (position, cityButtons) => {
    $scope.newCustomer.city = cityButtons[position];
    angular.forEach(cityButtons, (button, index) => {
      $scope.cityButtonStates[index] = (position == index);
    });
  }

  let getPhoneNumbers = () => { return $('#phoneInput').val(); }
  let getAddress = () => { return $('#addressInput').val(); }
  let getCross = () => { return $('#crossInput').val(); }
  let getNote = () => { return $('#noteInput').val(); }

  let prepareCustomer = () => {
    $scope.newCustomer.phone = getPhoneNumbers();
    $scope.newCustomer.address = getAddress();
    $scope.newCustomer.cross = getCross();
    $scope.newCustomer.note = getNote();
  }

  $scope.createCustomer = () => {

    prepareCustomer();
    console.log($scope.newCustomer);
    // $http.post('http://localhost:27017/customers/', $scope.newCustomer)
    //   .then((response) => {
    //
    //     hideContainer(createContainer, hidingRegistration);
    //     // TODO: Update UI with new customer information
    //     $http.get('http://localhost:27017/customers/' + searchInput.val())
    //       .then((response) => {
    //         $scope.customers = response.data.slice();
    //       });
    //
    //   }, (response) => {
    //
    //     $scope.errors.splice(0 ,$scope.errors.length);
    //     angular.forEach(response.data.errors, (error, index) => {
    //       $scope.errors.push(error.message);
    //     });
    //
    //   });


  }

  $scope.editField = (field) => {

  }

}]);
