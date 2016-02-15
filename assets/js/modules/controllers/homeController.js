angular.module('Controllers')
    .controller('HomeController', ['$scope', 'Helper',function ($scope, Helper) {

        $scope.contacts = [];

        ContactCRUDController.listUsers(currUser, currToken, function(result, event) {
            if (event.status && result != null) {
                $scope.contacts = JSON.stringify(result);
                console.log($scope.contacts);
            }
        });        
    }]);
