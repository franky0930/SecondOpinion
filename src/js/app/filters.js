/* Filters */

var appFilters = angular.module('appFilters', []);


appFilters
	.filter('splitTxt', function() {
		return function(str) {
			str = str.replace(/_/g,' ');
			return (str.search('none')===-1)?str:'none';
		};
	})
  // Searches for an object which match the parameters into an array.
  .filter('getByProperty', function() {
  return function(arr, property, value) {
    var i=0, len=arr.length;
    for (; i<len; i++) {
      if (+arr[i][property] == +value) {
        return arr[i];
      }
    }
    return null;
  }
});