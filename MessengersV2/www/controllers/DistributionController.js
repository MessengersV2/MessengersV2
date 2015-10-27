/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />

//***********************************************************  Constructor Start **********************************************************

scotchApp.controller('distributionController', function ($scope) {
    $scope.register = function () {
        alert('reg');
    };

    //###########################################################  Constructor Finish ###########################################################


  



    //***********************************************************  General Variables Start **********************************************************

    var currentBarcode = '';
    var index = 0;
    var barcodes = [];

    //###########################################################  General Variables Finish ###########################################################




    //***********************************************************  Scan Start **********************************************************

    $scope.onScan = function () {

        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);

        scotchApp.directive

    };


    function onSuccess(barcode) {
        currentBarcode = barcode;
        $('#packageinput').val(barcode);
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }

    //###########################################################  Scan Finish ###########################################################





    //***********************************************************  On Document Ready Start **********************************************************

    angular.element(document).ready(function () {

        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $("#warpPopup").hide();
        $("warpPopup").load('deliverPopup.html');
        
        $('#packageinput').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                Keyboard.hide();
            }
            return true;
        });

    });

    //###########################################################  On Document Ready Finish ###########################################################





    //***********************************************************  On Clicks Start **********************************************************

    $scope.open = function () {
        $("#warpPopup").show();
    };

    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };

    $scope.onAddBarCode = function () {
        currentBarcode = $('#packageinput').val();
        barcodes[index] = currentBarcode;
        index++;
        $("#deleteList").append('<li>' + currentBarcode + '</li>');
        $('#barcodeCount').text(index);
    };

    $scope.onOkPressed = function () {
        navigator.notification.alert('Sending request to server.');
    };

    //###########################################################  On Clicks Finish ###########################################################






});

