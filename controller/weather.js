app.controller('WeatherController', function($scope, $state, $window, $http, $interval) {
    $scope.home = function() {
        $state.go('photo');
    };
    $scope.hideWeather = true;
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.placefinder%20where%20text%3D%22%E8%95%89%E5%B2%AD%22)%20and%20u%3D%22c%22&format=json&diagnostics=true&callback=';
    $http({
        method: 'GET',
        url: url
        // params: {
        //     q:'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="蕉岭") and u="c"',
        //     format: 'json'
        // }
    }).success(function(data) {
        console.log(data);
        $scope.days = data.query.results.channel[0].item.forecast.slice(0, 3);
        $scope.days[0].day = '今天';
        $scope.days[1].day = '明天';
        $scope.days[2].day = '后天';
        $scope.hideWeather = false;
    });

    $scope.time = {};
    var getTime = function() {
        var time = new Date();
        $scope.time.hour = time.getHours() > 9 ? time.getHours() + '' : '0' + time.getHours();
        $scope.time.minute = time.getMinutes() > 9 ? time.getMinutes() + '' : '0' + time.getMinutes();
    };
    getTime();
    $interval(function() {
        getTime();
    }, 1000);

});