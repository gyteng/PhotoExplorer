app.controller('MusicController', function($scope, $state, angularPlayer, $window) {
    $scope.home = function() {
        $state.go('photo');
    };
    if(!$window.play) {
        $window.play = true;
        $window.music.forEach(function(e) {
            angularPlayer.addTrack(e);
        });
        angularPlayer.play();
        // $scope.playing = true;
        if(!angularPlayer.getRepeatStatus()) {
            angularPlayer.repeatToggle();
        }
    }

    $scope.playAndPause = function() {
        if($window.play) {
            angularPlayer.pause();
            $window.play = false;
        } else {
            angularPlayer.play();
            $window.play = true;
        }       
    };
    
    $scope.next = function() {
        $window.play = true;
        angularPlayer.nextTrack();
    };
    $scope.prev = function() {
        $window.play = true;
        angularPlayer.prevTrack();
    };
});