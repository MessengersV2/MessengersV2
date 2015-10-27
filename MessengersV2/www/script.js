var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })

        // route for the about page
        .when('/resetPass', {
            templateUrl: 'pages/resetPass.html',
            controller: 'forgetPassController'
        })
     .when('/distribution', {
         templateUrl: 'pages/distribution.html',
         controller: 'distributionController'
     })
     .when('/collect', {
         templateUrl: 'pages/collect.html',
         controller: 'collectController'
     })
     .when('/collect_joined', {
         templateUrl: 'pages/collect_joined.html',
         controller: 'collect_joinedController'
     })
     .when('/deliver', {
         templateUrl: 'pages/deliver.html',
         controller: 'deliverController'
     })



    
    ;

});
