let app = angular.module('acid', ['ngRoute', 'ngAnimate', 'appRoutes', 'CustomerController', 'NerdController', 'CustomerService']);

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
    template: '<div class="text-center"> <h4 class="h4-responsive">{{ title }}</h4> <p class="black-text">{{ content }}</p> </div>',
    link: (scope, elem, attrs) => {}
  };
});

app.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);

app.filter('telephone', function() {
  return function(telephone) {
    if (!telephone) {
      return '';
    }

    var value = telephone.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return telephone;
    }

    var country, city, number;

    switch (value.length) {
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return telephone;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };
});
