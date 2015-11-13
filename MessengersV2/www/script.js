var scotchApp = angular.module('scotchApp', ['ngRoute', 'ngAutocomplete']);
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
          .when('/deliver/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet', {
              templateUrl: 'pages/deliver.html',
              controller: 'deliverController'
          })

   .when('/deliverJoined', {
       templateUrl: 'pages/deliver_joined.html',
       controller: 'deliverJoinedController'
   })

         .when('/weightNormal/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet', {
             templateUrl: 'pages/weight_control_normal.html',
             controller: 'weightNormalController'
         })


     .when('/weightNormal', {
         templateUrl: 'pages/weight_control_normal.html',
         controller: 'weightNormalController'
     })



     .when('/weightItem', {
         templateUrl: 'pages/weight_control_item.html',
         controller: 'weightItemController'
     })

          .when('/weightItem/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures', {
              templateUrl: 'pages/weight_control_item.html',
              controller: 'weightItemController'
          })

         .when('/weightItem/barcode/:barcode', {
             templateUrl: 'pages/weight_control_item.html',
             controller: 'weightItemController'
         })



     .when('/weightPallet', {
         templateUrl: 'pages/weight_control_plate.html',
         controller: 'weightPalletController'
     })
          .when('/weightPallet/originalWeight/:originalWeghit/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet', {
              templateUrl: 'pages/weight_control_plate.html',
              controller: 'weightPalletController'
         })


     .when('/balanceOk', {
         templateUrl: 'pages/report_ok.html',
         controller: 'reportOkController'
     })


     .when('/register', {
         templateUrl: 'pages/register.html',
         controller: 'registerController'
     })


    ;

});

 