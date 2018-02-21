angular.module('CustomerController', []).controller('CustomerController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

  $scope.tagline = 'Let\'s get some pizza ready!';
  $scope.customers = [];
  $scope.newCustomer = {
    phone: [],
    city: "",
    address: "",
    cross: "",
    note: "",
    name: "",
    type: "Personal",
    email: "",
    ordered: false
  };
  $scope.cities = ["BL", "SC", "SM", "RWS", "RWC", "FC", "HB"];
  $scope.errors = [];
  $scope.accountTypes = ["Personal", "Business"];

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
  $scope.showingSearch = true;

  const customersURL = 'http://localhost:27017/customers/';
  const emptyCustomer = {
    phone: [],
    city: "",
    address: "",
    cross: "",
    note: "",
    name: "",
    type: "Personal",
    email: "",
    ordered: false
  };

  let animations = {
    createTransition: 'tada',
    editSuccess: 'flash',
    createFailure: 'shake',
    editFailure: 'shake'
  };

  // md-chips settings
  let semicolon = 186, comma = 188, enter = 13;
  const self = this;
  $scope.chips = {
    readonly: false,
    removable: true,
    keys: [enter, comma, semicolon],
    max: 3
  };

  const map = $('#map');
  const Avanti = 'Avanti+Pizza,Belmont+CA+USA';
  const mapTemplate = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBX8d3MNFqAY2PIqx4Y7OFc54TNS-ej6jg&" +
    "origin="+Avanti+"&destination=";

  let setMapDestination = (destination) => {
    if (destination != '') map[0].src = mapTemplate + destination;
    else map[0].src = mapTemplate + Avanti;
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

  function addClassTo(element, className) {
    if (!element.hasClass(className)) element.addClass(className);
  }

  function slideAndShow(container) {
    container.removeClass('hidden fadeOutLeft');
  }

  function slideIn(container, hiding) {
    container.removeClass('fadeOutRight');
    searchContainer.addClass('fadeOutLeft').one(
      'animationend', (error) => {
        if (hidingSearchContainer) searchContainer.addClass('hidden');
    });
    setTimeout(() => {
      slideAndShow(container);
      $scope.$apply(() => {
        $scope.showingSearch = false
      });
    }, 800);

  }

  function slideOut(container, hiding) {

    searchContainer.removeClass('fadeOutRight');
    $scope.showingSearch = true;
    container.addClass('fadeOutRight').one(
      'animationend', (error) => {
        if (!hidingSearchContainer && hiding) {
          container.addClass('fadeInRight hidden');
        }
    });
    setTimeout(() => {
      slideAndShow(searchContainer);
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
    if (container.hasClass(animations.createTransition)) {
      container.removeClass(animations.createTransition);
      container.addClass('fadeInRight');
    }
    slideOut(container, hiding);

  }

  function segueToEditContainer() {
    createContainer.addClass('fadeOutRight hidden');
    editContainer.removeClass('fadeInRight hidden fadeOutRight');
    editContainer.addClass(animations.createTransition).one('animationend', (error) => {
      editContainer.removeClass(animations.createTransition);
    });
    setCurrent(editContainer, hidingEditContainer);
  }

  $scope.hideContainer = function() {
    hideContainer(currentContainer, currentHiding);
  }

  let numberOfCustomers = () => { return $scope.customers.length; }
  let resetNewCustomer = () => { $scope.newCustomer = Object.assign({}, emptyCustomer); }

  function getSearchPath(selectedSearchType) {
    switch (selectedSearchType) {
      case 'phone':
        return customersURL + getSearchValue();
      default:
        console.log('getSearchPath defaulting </3');
    }
  }

  function getCurrentPath(data) {
    switch (getCurrentSearchType()) {
      case 'phone':
        return customersURL + data.phone[0];
      default:
        console.log("getCurrentPath defaulting!!! Check CustomerController for debugging!");
    }
  }

  function getCurrentSearchType() {
    return 'phone';
  }

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

      }
      return;
    }

    $scope.logNewCustomer = () => {
      console.log($scope.newCustomer);
    }

    let fromSearchType = getCurrentSearchType();
    $http.get(getSearchPath(fromSearchType))
      .then((response) => {

        if (getMapDestination() != Avanti) setMapDestination(Avanti);

        resetNewCustomer();
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
        }
        else if (!hasSearchedOnce) {
          hasSearchedOnce = true; // Prevent redundant animation by breaking here
        }
        else
        {
          hideContainer(createContainer, hidingRegistration);
        }
      });

  });

  $scope.inputToInteger = (sender) => {
    if (sender == 'edit') {
      for (let index in $scope.selected.phone) {
        let input = $scope.selected.phone[index];
        if (typeof(input) === 'string') {
          $scope.selected.phone[index] = Number(input);
        }
      }
    } else if (sender == 'create') {
      for (let index in $scope.newCustomer.phone) {
        let input = $scope.newCustomer.phone[index];
        if (typeof(input) === 'string') {
          $scope.newCustomer.phone[index] = Number(input);
        }
      }
    }
  }

  let createButton = $('#createButton');
  let editButton = $('#editButton');
  let showCreateFailedVisuals = () => {
    createButton.addClass(animations.createFailure).one('animationend', (error) => {
      createButton.removeClass(animations.createFailure);
    });
  }

  let showFailedEditVisuals = () => {
    editButton.addClass(animations.editFailure).one('animationend', (error) => {
      editButton.removeClass(animations.editFailure);
    });
  }

  let showSuccessfulEditVisuals = () => {
    $scope.confettiBurst();
    editContainer.removeClass('fadeInRight');
    editContainer.addClass(animations.editSuccess).one('animationend', (error) => {
      editContainer.removeClass(animations.editSuccess);
    });
  }

  let getPhoneNumbers = () => { return $scope.newCustomer.phone; }
  let getAddress = () => { return $('#addressInput').val(); }
  let getCross = () => { return $('#crossInput').val(); }
  let getNote = () => { return $('#noteInput').val(); }
  let getName = () => { return $('#nameInput').val(); }
  let getAccountType = () => { return $('#accountSelect').val(); }
  let getEmail = () => { return $('#emailInput').val(); }

  let customerOrdered = () => { return $scope.newCustomer.ordered; }
  $scope.createCustomer = () => {

    if (customerOrdered()) {
      $scope.newCustomer.ordered = (new Date).getTime();
    }

    $http.post('http://localhost:27017/customers/', $scope.newCustomer)
      .then((response) => {

        $scope.confettiBurst();
        $http.get(getCurrentPath($scope.newCustomer))
          .then((response) => {
            $scope.customers = response.data.slice();
            $scope.selected = $scope.customers[0];

            if (typeof($scope.newCustomer.ordered) === 'number') {
              $scope.newCustomer.ordered = true;
            }
            segueToEditContainer();
            setMapDestination($scope.selected.address);

          });

      }, (response) => {

        $scope.errors.splice(0 ,$scope.errors.length);
        angular.forEach(response.data.errors, (error, index) => {
          $scope.errors.push(error.message);
        });
        showCreateFailedVisuals();

      });


  }

$scope.editCustomer = () => {

  if (customerOrdered()) {
    $scope.newCustomer.ordered = (new Date).getTime();
    $scope.selected.ordered = (new Date).getTime();
  }

  $http.put(getCurrentPath($scope.selected), $scope.selected)
    .then((response) => {

      $http.get(getCurrentPath($scope.selected))
        .then((response) => {

          showSuccessfulEditVisuals();
          if (typeof($scope.newCustomer.ordered) === 'number') {
            $scope.newCustomer.ordered = true;
          }
          $scope.customers = response.data.slice();
          setMapDestination($scope.customers[0].address);

        }, (response) => {

          $scope.errors.splice(0 ,$scope.errors.length);
          angular.forEach(response.data.errors, (error, index) => {
            $scope.errors.push(error.message);
          });
          showFailedEditVisuals();

        });

    }, (response) => {
      console.log('POST Update failing in CustomerController');
    });
}

/****************************************
*************CONFETTI SECTION************
****************************************/

let canvas, ctx, W, H;
let mp = 200; //max particles
let confettiWidth = 1.15;
let particles = [];
let angle = 0;
let tiltAngle = 0;
let confettiActive = true;
let animationComplete = true;
let deactivationTimerHandler, reactivationTimerHandler, animationHandler;

let particleColors = {
    colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
    colorIndex: 0,
    colorIncrementer: 0,
    colorThreshold: 10,
    getColor: function () {
        if (this.colorIncrementer >= 10) {
            this.colorIncrementer = 0;
            this.colorIndex++;
            if (this.colorIndex >= this.colorOptions.length) {
                this.colorIndex = 0;
            }
        }
        this.colorIncrementer++;
        return this.colorOptions[this.colorIndex];
    }
}

$scope.confettiBurst = () => {
  $scope.activate();
  setTimeout($scope.deactivate, 1200);
}

function confettiParticle(color) {
    this.x = Math.random() * W; // x-coordinate
    this.y = (Math.random() * H) - H; //y-coordinate
    this.r = RandomFromTo(10, 30); //radius;
    this.d = (Math.random() * mp) + 10; //density;
    this.color = color;
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
    this.tiltAngle = 0;

    this.draw = function () {
        ctx.beginPath();
        ctx.lineWidth = this.r * confettiWidth;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
        return ctx.stroke();
    }
}

$(document).ready(function () {
    SetGlobals();
    InitializeConfetti();

    $(window).resize(function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });

    StopConfetti();
});

function SetGlobals() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

function InitializeConfetti() {
    particles = [];
    animationComplete = false;
    for (let i = 0; i < mp; i++) {
        let particleColor = particleColors.getColor();
        particles.push(new confettiParticle(particleColor));
    }
    StartConfetti();
}

function Draw() {
    ctx.clearRect(0, 0, W, H);
    let results = [];
    for (let i = 0; i < mp; i++) {
        (function (j) {
            results.push(particles[j].draw());
        })(i);
    }
    Update();

    return results;
}

function RandomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function Update() {
    let remainingFlakes = 0;
    let particle;
    angle += 0.01;
    tiltAngle += 0.1;

    for (let i = 0; i < mp; i++) {
        particle = particles[i];
        if (animationComplete) return;

        if (!confettiActive && particle.y < -15) {
            particle.y = H + 100;
            continue;
        }

        stepParticle(particle, i);

        if (particle.y <= H) {
            remainingFlakes++;
        }
        CheckForReposition(particle, i);
    }

    if (remainingFlakes === 0) {
        StopConfetti();
    }
}

function CheckForReposition(particle, index) {
    if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
        if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
        {
            repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
        } else {
            if (Math.sin(angle) > 0) {
                //Enter from the left
                repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
            } else {
                //Enter from the right
                repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
            }
        }
    }
}

function stepParticle(particle, particleIndex) {
    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
    particle.x += Math.sin(angle);
    particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
}

function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
    particle.x = xCoordinate;
    particle.y = yCoordinate;
    particle.tilt = tilt;
}

function StartConfetti() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    (function animloop() {
        if (animationComplete) return null;
        animationHandler = requestAnimFrame(animloop);
        return Draw();
    })();
}

function ClearTimers() {
    clearTimeout(reactivationTimerHandler);
    clearTimeout(animationHandler);
}

$scope.deactivate = function DeactivateConfetti() {
    confettiActive = false;
    ClearTimers();
}

function StopConfetti() {
    animationComplete = true;
    if (ctx == undefined) return;
    ctx.clearRect(0, 0, W, H);
}

$scope.activate = function RestartConfetti() {
    ClearTimers();
    StopConfetti();
    reactivationTimerHandler = setTimeout(function () {
        confettiActive = true;
        animationComplete = false;
        InitializeConfetti();
    }, 100);

}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };
})();



}]);
