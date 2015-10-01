app.controller('MusicController', function($scope, $state) {
    $scope.home = function() {
        $state.go('photo');
    };
    $scope.songs = window.music.map(function(e) {
        console.log(e);
        return {
            id: e,
            title : e,
            artist: 'unknown',
            url : 'http://127.0.0.1:22501/' + e
        };
    });
});