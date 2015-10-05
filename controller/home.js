app.controller('HomePageController', function($scope, $state, $interval, $window, hotkeys) {
    hotkeys.add({
        combo: 'ctrl+g',
        description: 'This one goes to homepage',
        callback: function() {
            $state.go('home');
        }
    });
    $scope.batteryClass = 'fa fa-battery-full fa-3x';
    $scope.goToPage = function(place) {
        $state.go(place);
    };

    $scope.$watch(
        function () {
            return $window.battery; 
        }, function(n, o){
            $scope.battery = (' ' + $window.battery + '%') || '';
            if(+$window.battery >= 87.5) {
                $scope.batteryClass = 'fa fa-battery-full fa-3x';
            } else if (+$window.battery >= 62.5) {
                $scope.batteryClass = 'fa fa-battery-three-quarters fa-3x';
            } else if (+$window.battery >= 37.5) {
                $scope.batteryClass = 'fa fa-battery-half fa-3x';
            } else if (+$window.battery >= 12.5) {
                $scope.batteryClass = 'fa fa-battery-quarter fa-3x';
            } else {
                $scope.batteryClass = 'fa fa-battery-empty fa-3x text-danger';
            }
        }
    );
    
});