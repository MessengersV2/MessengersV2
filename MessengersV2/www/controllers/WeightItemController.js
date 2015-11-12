scotchApp.controller('weightItemController', function ($scope, $routeParams) {
    var currentBarcode = '';
    var countPictures = 0;
    var isBarcodeOk = false;
    var fixedWeight = "0";
    var originalWeight = "0";
    var kodMesira = '';

    //#region On Ready Angular
    angular.element(document).ready(function () {
        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            kodMesira = $routeParams.kodmesira;
        }
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");

        var kg = originalWeight[0] + originalWeight[1];
        var grm = originalWeight[2] + originalWeight[3] + originalWeight[4];

        $("#kgOrg").val(kg);
        $("#grmOrg").val(grm);
        $.sidr('close', 'simple-menu');
        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                Keyboard.hide();
            }
            return true;
        });

    });
    //#endregion

    $scope.onOk = function () {
        if ($("#kgFixed").val() == '') {
            navigator.notification.alert('יש להזין ק"ג מתוקן');
        }
        else if ($("#grmFixed").val() == '') {
            navigator.notification.alert('יש להזין ק"ג מתוקן');
        }
        else {
            var MAX_EE_WT = localStorage.getItem("MAX_EE_WT");
            var select = $("#kgFixed").val() + $("#grmFixed").val();
            var selectToChecl = select[0] + select[1];
            if (MAX_EE_WT < selectToChecl) {
                navigator.notification.alert("משקל שהוקלד גדול מהמשקל המותר");
            }
            else {
                if (select.length > 5) {
                    select = select[0] + select[1] + select[2] + select[3] + select[4];
                }
                else {
                    while (select.length != 5) {
                        select = select + "0";
                    }
                }
                var isPalet = "0";
                location.href = "#/deliver/originalWeight/" + originalWeight + "/barcode/" + currentBarcode + "/fixedWeight/" + select + "/kodmesira/" + kodMesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;

            }
        }

    }
});


