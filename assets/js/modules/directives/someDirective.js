angular.module('Directives')

	// Utilities is being injected (dependency injection), for being used in this directive. It could be a service, factory, etc.
    .directive('someDirective', ['Utilities', function(Manager, Utilities) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'some-directive.html',
            link: function(scope, element, attrs) {

            }
        };
    }])
