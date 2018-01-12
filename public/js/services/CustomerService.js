angular.module('CustomerService', []).factory('Customer', ['$http', function($http) {

  // return {
  //     // Call to get all customers
  //   get : () => {
  //     return $http.get('/api/customers');
  //   },
  //     // Call to POST and create a new customer
  //   create: (customerData) => {
  //       return $http.post('api/customers', customerData);
  //   },
  //     // Call to DELETE a customer
  //   delete: (cid) => {
  //     return $http.delete('/api/customers/' + cid);
  //   }
  // }

}]);
