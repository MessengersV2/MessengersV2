/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />


scotchApp.controller('deliverController', function ($scope) {
    $scope.register = function () {
        alert('reg');
    };

    //#region JQuery On Document Ready
    $(document).ready(function () {
        $('.sigPad').signaturePad({ drawOnly: true });
        $('.sigPad').signaturePad({ lineWidth: 0 });
        $('.sigPad').signaturePad({ lineColour: '#FFFFFF' });
        $('.sigPad').signaturePad({ penColour: '#000000' });

    });
    //#endregion JQuery On Document Ready

    //#region General Variables
    var currentBarcode = '';
    var index = 0;
    var barcodes = [];
    var indexPic = 0;
    var pictures = [];
    var base64Signature = '';
    //#endregion General Variables

    //#region On Scan Barcode
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
    //#endregion On Scan Barcode

    //#region Angular Document Redy
    angular.element(document).ready(function () {

        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $("#warpPopup").hide();
        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                Keyboard.hide();
            }
            return true;
        });



    });
    //#endregion Angular Document Redy

    //#region On Open Popup
    $scope.open = function () {
        $("#warpPopup").show();
    };
    //#endregion On Open Popup

    //#region On X Click
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion On X Click

    //#region On Add Barcode
    $scope.onAddBarCode = function () {
        currentBarcode = $('#packageinput').val();
        barcodes[index] = currentBarcode;
        index++;
        $("#deleteList").append('<li>' + currentBarcode + '</li>');
        $('#barcodeCount').text(index);
    };
    //#endregion   On Add Barcode

    //#region On Send To Server Request
    $scope.onOkPressed = function () {
        if ($("#dropDownMenuKategorie")[0].selectedIndex == 0){
            navigator.notification.alert('יש לבחור קוד מסירה \ אי מסירה');
        }
        else if ($('.packageinput2').value = '' || $('.packageinput2').value == null) {
            navigator.notification.alert('יש להכניס ברקוד');
        }
        else {
            navigator.notification.alert('Sending request to server.');
        }
    };
    //#endregion AutoComplete JS

    //#region Camera Handler.
    $scope.onTakePicture = function () {
        navigator.camera.getPicture(onCameraSuccess, onCameraFail,
            {
                quality: 40,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL,
                saveToPhotoAlbum: false
            });
    };

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

    //#endregion Camera Handler.

    //#region Get signature Base64
    $scope.onSaveSignarture = function () {
        var canvas = document.getElementById('pad');
        var context = canvas.getContext('2d');
        base64Signature = canvas.toDataURL().split(',')[1];
        $("#warpPopup").hide();
    };
    //#endregion Get signature Base64

    //#region On Deliver Joined
    $scope.onDeliverJoined = function () {
        window.location.href = "#/deliverJoined";
    };
    //#endregion On Deliver Joined
});

