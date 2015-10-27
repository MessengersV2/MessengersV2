/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />

//***********************************************************  Constructor Start **********************************************************

scotchApp.controller('deliverController', function ($scope) {
    $scope.register = function () {
        alert('reg');
    };

    //###########################################################  Constructor Finish ###########################################################






    //***********************************************************  General Variables Start **********************************************************

    var currentBarcode = '';
    var index = 0;
    var barcodes = [];
    var indexPic = 0;
    var pictures = [];


    //###########################################################  General Variables Finish ###########################################################




    //***********************************************************  Scan Start **********************************************************

    $scope.onScan = function () {

        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
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

        var canvas = document.querySelector(".pad");

        var signaturePad = new SignaturePad(canvas, {
            penColor: "rgb(66, 133, 244)"
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


    $scope.onTakePicture = function () {
        navigator.camera.getPicture(onCameraSuccess, onCameraFail,
            {
                quality: 40,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL,
                saveToPhotoAlbum: false
            });
    };



    //###########################################################  On Clicks Finish ###########################################################


    function onCameraSuccess(imageData) {
        console.log('get pictutre success');
        var image1 = document.getElementById('Image1');
        pictures[indexPic] = imageData;
        indexPic++;
        navigator.notification.alert("Got Picture!");
        //image1.style.visibilty="visible";
        //image1.style.display='block';
        //image1.src = "data:image/jpeg;base64," + imageData;
    }

    function onCameraFail(message) {
        console.log('camera error: ' + message);
        if (message != 'Camera cancelled.') {
            var errorMessage = 'סליחה, מצלמת האנדרואיד נתקלה בבעיה. ייתכן שיהיה עליך להפעיל מחדש את המכשיר';
            displayErrorMessage(errorMessage);
        }
    }







});

