angular.module('Controllers')
    .controller('LoginController', ['$scope', 'Helper', '$location', 
                                        function ($scope, Helper, $location) {

        $scope.submit = function() {
            // Visualforce.remoting.Manager.invokeAction(
            //     '{!$RemoteAction.authController.userLogin}',
            //     [$scope.username,
            //     $scope.password],
            //     function(result,event) {

            //     },
            //     {escape: true}
            // );

            // alert($scope.username);
            //$token =  CallApexLoginMethod($scope.username, $scope.password);
            alert('Click' +
                '\n' +
                'Username: ' + 
                $scope.username +
                '\n' +
                'Password: ' +
                $scope.password);

            // this.clientId = $token;


            // if (authController.userLogin($scope.username, $scope.password)) {
            //     $("nav").show();
            //     $location.path('/home');
            // } else {
            //     alert('You sure those are your credentials?');
            //     $scope.username = null;
            //     $scope.password = null;
            // };
        };
    }]);
