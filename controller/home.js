app.controller('HomePageController', function($scope, $state, hotkeys) {
    hotkeys.add({
        combo: 'ctrl+g',
        description: 'This one goes to homepage',
        callback: function() {
            $state.go('home');
        }
    });
    $scope.goToPage = function(place) {
        $state.go(place);
    };
});