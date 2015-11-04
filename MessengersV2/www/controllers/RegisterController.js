/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />

//***********************************************************  Constructor Start **********************************************************

scotchApp.controller('registerController', function ($scope) {

    angular.element(document).ready(function () {


        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $.sidr('close', 'simple-menu');
    });


    $scope.onScan = function () {

        cloudSky.zBar.scan({
            camera: "back", // defaults to "back"
            flash: "on" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);


        function onSuccess(barcode) {
            $scope.$apply(function () {
                $scope.inputVal = barcode;
            });
        }

        function onFailure(data) {
            navigator.notification.alert('In cancelCallback');
        }
    };


    $scope.onDisterbute = function () {
        location.href = "#/distribution";
    };

});

