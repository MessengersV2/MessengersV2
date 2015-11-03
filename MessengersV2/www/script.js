var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/resetPass.html',
            controller: 'forgetPassController'
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

   .when('/deliverJoined', {
       templateUrl: 'pages/deliver_joined.html',
       controller: 'deliverJoinedController'
   })


     .when('/weightNormal', {
         templateUrl: 'pages/weight_control_normal.html',
         controller: 'weightNormalController'
     })

     .when('/weightItem', {
         templateUrl: 'pages/weight_control_item.html',
         controller: 'weightItemController'
     })

     .when('/weightPallet', {
         templateUrl: 'pages/weight_control_item.html',
         controller: 'weightPalletController'
     })


    ;

});
