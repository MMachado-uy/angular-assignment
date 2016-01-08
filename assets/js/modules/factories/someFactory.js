angular.module('Factories').factory('SomeFactory', ['$q', function($q) {

    var getSomeData = function(someParam) {
        var deferred = $q.defer();
		
		// Interact with some data from the server. 
		// This example calls a remote action defined in an APEX class called SomeController.
		
		SomeController.SomeMethod(someParam, function(result,event){
            if (event.status) {
                deferred.resolve(result); 
            } else {
                deferred.reject(event);
            }           
        },
        { buffer: false, escape: true, timeout: 30000 });
        
        return deferred.promise;   
    }
	
    // Add every method defined in this factory to the return object
    return {
        getSomeData: getSomeData
    }

}]);
