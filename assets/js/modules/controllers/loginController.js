angular.module('Controllers')
    .controller('LoginController', ['$scope', 'Helper', '$location', 
                                        function ($scope, Helper, $location) {

        $scope.submit = function() {

            authController.userLogin($scope.username, $scope.password, function(result, event) {
                if (event.status && result != null) {
                    $("nav").show();
                    $location.path('/home');
                    currUser = $scope.username;
                    currToken = result;
                    document.getElementById("user-menu").innerHTML = currUser;
                } else {
                    $scope.username = null;
                    $scope.password = null;
                    alert('You sure those are your credentials?');
                };
            });
        };
    }]);
