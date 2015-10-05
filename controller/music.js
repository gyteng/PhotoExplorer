app.controller('MusicController', function($scope, $state, angularPlayer, $window) {
    // var list = {
    //     'tsyj.mp3': '涛声依旧',
    //     'wsqszsq.mp3': '万水千山总是情',
    //     'wzzhn.mp3': '我只在乎你'
    // };
    // $scope.$on('track:id', function(event, data) {
    //     $scope.name = list[data] || '';
    // });
    if(!$window.play) {
        $window.play = true;
        $window.music.forEach(function(e) {
            angularPlayer.addTrack(e);
        });
        angularPlayer.play();
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