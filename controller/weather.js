app.controller('WeatherController', function($scope, $state, $window, $http) {
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
        $scope.days = data.query.results.channel[0].item.forecast;
        $scope.hideWeather = false;
    });


});