angular.module('Filters')
    
    ////////////////////////////////////////////////////////////
    // Your filters
    ////////////////////////////////////////////////////////////

    .filter('someFilter', function() {
        return function(someParam, otherParam) {
			// Return the result of the filtering.
        };
    })
