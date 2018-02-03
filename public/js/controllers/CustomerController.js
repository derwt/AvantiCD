angular.module('CustomerController', []).controller('CustomerController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers = [];
  $scope.newCustomer = {
    phone: [],
    city: "",
    address: "",
    cross: "",
    note: ""
  };
  $scope.cities = ["BL", "SC", "SM", "RWS", "RWC", "FC", "HB"];
  $scope.cityColors = ["green", "orange", "cyan", "amber", "red", "purple", "black"];
  $scope.cityButtonStates =[false, false, false, false, false, false, false];
  $scope.errors = [];

  $scope.headers = {
    edit:
    [
      "👩‍🍳 What a great customer!",
      "Let's serve up a 🍕 of heaven!",
      "😋 I love this part!"
    ],
    create:
    [
      "Hooray 🎉 a new customer!",
      "🤑 We must be doing something right!",
      "👃 I can smell the pizza already!"
    ]
  };
  $scope.randomIndex = 0;

  let semicolon = 186;
  let comma = 188;
  let enter = 13;

  // md-chips settings
  const self = this;
  $scope.chips = {
    readonly: false,
    removable: true,
    keys: [enter, comma, semicolon],
    max: 3
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

  $scope.logSelected = function() {
    console.log($scope.selected);
  }

  function RandomInRange(min, max) {
    return Math.floor((Math.random() * max) + min);
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
      switch (currentContainer) {
        case editContainer:
          for (i in $scope.selected.phone) {
            // Reject duplicate values
            if (Number($chip) == $scope.selected.phone[i]) {
              return null;
            }
          }
          break;
        case createContainer:
          for (i in $scope.newCustomer.phone) {
            // Reject duplicate values
            if (Number($chip) == $scope.newCustomer.phone[i]) {
              return null;
            }
          }
          break;
        default:
          console.log("Error! Current container not valid!");
      }
      break;
  }
}

  let getSearchValue        = () => { return searchInput.val(); }
  let digitsLength     = () => { return getSearchValue().length; }
  let searchInputReady  = () => { return digitsLength() == 10; }

  let searchContainer = $('#searchContainer');
  let createContainer  = $('#createContainer');
  let editContainer = $('#editContainer');

  let hasSearchedOnce = false;
  let hidingSearchContainer, hidingRegistration, hidingEditContainer = false;
  let currentContainer, currentHiding = null;

  let setCurrent = (container, hiding) => {
    currentContainer = container;
    currentHiding = hiding;
  }

  function removeClassFrom(element, className) {
    if (element.hasClass(className)) element.removeClass(className);
  }

  function addClassTo(element, className) {
    if (!element.hasClass(className)) element.addClass(className);
  }

  function slideAndHide(container) {
    removeClassFrom(container, 'hidden');
    removeClassFrom(container, 'fadeOutLeft');
  }

  function slideIn(container, hiding) {

    container.removeClass('fadeOutRight');
    if (!searchContainer.hasClass('fadeOutLeft')) searchContainer.addClass('fadeOutLeft').one(
      'animationend', (error) => {
        if (hidingSearchContainer) searchContainer.addClass('hidden');
    });
    setTimeout(() => {
      slideAndHide(container);
    }, 800);
  }

  function slideOut(container, hiding) {

    removeClassFrom(searchContainer, 'fadeOutRight');
    if (!container.hasClass('fadeOutRight')) container.addClass('fadeOutRight').one(
      'animationend', (error) => {
        if (!hidingSearchContainer && hiding) container.addClass('hidden');
    });
    setTimeout(() => {
      slideAndHide(searchContainer);
      addClassTo(searchContainer, 'fadeInLeft');
    }, 800);

  }

  function showContainer(container, hiding) {

    hiding = false;
    hidingSearchContainer = true;
    setCurrent(container, hiding);
    slideIn(container, hiding);

  }

  function hideContainer(container, hiding) {

    hiding = true;
    setCurrent(null, hiding);
    hidingSearchContainer = false;
    slideOut(container, hiding);
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

        if (numberOfCustomers() == 0)
        {
          $scope.newCustomer.phone = [getSearchValue()];
          $scope.randomIndex = RandomInRange(0, $scope.headers.create.length);
          showContainer(createContainer, hidingRegistration);
        }
        else if (numberOfCustomers() == 1)
        {
        $scope.randomIndex = RandomInRange(0, $scope.headers.edit.length);
        $scope.select($scope.customers[0]);
        }
        else if (!hasSearchedOnce) {
          hasSearchedOnce = true;
        }
        else
        {
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
    $http.post('http://localhost:27017/customers/', $scope.newCustomer)
      .then((response) => {

        hideContainer(createContainer, hidingRegistration);
        // TODO: Update UI with new customer information
        $http.get('http://localhost:27017/customers/' + searchInput.val())
          .then((response) => {
            $scope.customers = response.data.slice();
          });

      }, (response) => {

        $scope.errors.splice(0 ,$scope.errors.length);
        angular.forEach(response.data.errors, (error, index) => {
          $scope.errors.push(error.message);
        });

      });


  }

  $scope.editField = (field) => {

  }

}]);
