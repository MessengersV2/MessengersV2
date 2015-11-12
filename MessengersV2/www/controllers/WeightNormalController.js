﻿scotchApp.controller('weightNormalController', function ($scope, $routeParams) {

    var originalWeghit = "";
    var barcode = "";
    var kodmesira = "";
    var countPictures = "";
    var isPalet = "";
    angular.element(document).ready(function () {
        if ($routeParams.originalWeight) {
            originalWeghit = $routeParams.originalWeight;
            barcode = $routeParams.barcode;
            kodmesira = $routeParams.kodmesira;
            countPictures = $routeParams.countPictures;
            isPalet = $routeParams.isPalet;
        }

        $("#packageinput").val(barcode);
        $(".packageinput4").val(originalWeghit);
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
    });


    $scope.$watch('value', function (value) {
        if (value == 2) {
            if (barcode != '' && originalWeghit != '') {

            }
            if (originalWeghit != "") {
                var select = "0";
                isPalet = "0";
                location.href = "#/weightPallet/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;
            }
            else {
                window.location.href = "#/weightPallet";

            }
        }

    });


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
        $('#packageinput').val(barcode);
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }
    //#endregion On Scan Barcode

    $scope.onOkPressed = function () {
        if (barcode != '' && originalWeghit != '') {
            var select = $(".area").val();
            if (select == "-1") {
                navigator.notification.alert("יש לבחור משקל מתוקן");
            }
            else {
                location.href = "#/deliver/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;
            }
        }
    };

});


