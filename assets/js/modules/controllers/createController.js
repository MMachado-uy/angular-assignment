angular.module('Controllers')
    .controller('CreateController', ['$scope', 'Helper',function ($scope, Helper) {

        $scope.submit = function() {

            ContactCRUDController.createContact($scope.name, $scope.lastname, currUser, currToken, function (result, event) {
                if (event.status && result != null) {
                    $scope.name = null;
                    $scope.lastname = null;
                    alert('Done!')
                }
                if (result == null) {
                    alert('Something went wrong');
                }
            });
            $scope.name = null; 
            $scope.lastname = null; 
        }
    }]);
