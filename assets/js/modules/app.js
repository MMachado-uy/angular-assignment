(function() {

    ////////////////////////////////////////////////////////////
    // App
    ////////////////////////////////////////////////////////////

    var App = angular.module('YourApp', [
                                    'ngRoute', 
                                    'pasvaz.bindonce', 
                                    'Controllers', 
                                    'Directives', 
                                    'Factories', 
                                    'Filters', 
                                    'Services', 
                                    'ngSanitize'
        ]);

    ////////////////////////////////////////////////////////////
    // CONFIG
    ////////////////////////////////////////////////////////////

    App.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
        
		/*
		 * DataResolve is a function that ends up returning a promise.
		 * This function is then passed to every route that needs it.
	     * Views won't be loaded until the promise is resolved, allowing to 
         * initialize data with a request.
		*/

        /*
         * "Helper" is a service with a method that returns 
         * a promise which loads some data when resolved.
         */
        // var dataResolve = function(Helper, $route) {
        //     return Helper.helperMethod(param1, param2);
        // }

        $routeProvider.when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            // resolve: {teams: dataResolve}
        });
		
        $routeProvider.when('/create', {
            templateUrl: 'pages/create.html',
            controller: 'CreateController'
        });

        $routeProvider.when('/edit', {
            templateUrl: 'pages/edit.html',
            controller: 'EditController'
        });

        $routeProvider.when('/edit', {
            templateUrl: 'pages/edit.html',
            controller: 'EditController'
        });        

        $routeProvider.when('/', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController'
        });

        $routeProvider.otherwise({
            redirectTo: '/#login'
            // resolve: {teams: dataResolve}
        });

    }]);
})();
