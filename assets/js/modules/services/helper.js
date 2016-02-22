angular.module('Services').service('Helper', ['$q', function ($q, Utilities) {

    this.helperMethod = function (param1, param2) {
		// Return whatever. Each service is a singleton, so this could be used to define methods to perform 
		// AJAX request to the server and return a promise.
     
        // ContactCRUDController.listUsers(currUser, currToken, function(result, event) {
        //     if (event.status && result != null) {
        //         $scope.contacts = JSON.stringify(result);
        //         console.log('Hello World');
        //     }
        // });
	
        var something = "test";
        return something;
    }

}]);
