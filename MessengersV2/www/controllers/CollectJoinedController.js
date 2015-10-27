scotchApp.controller('collect_joinedController', function ($scope, $routeParams) {

    $scope.scan = function () {
        scan();
    };


    $scope.onCollect = function () {
        window.location.href = "#/collect";
    };



    angular.element(document).ready(function () {
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $.sidr('close', 'simple-menu');
    });

    function scan() {
        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    }

    function onSuccess(barcode) {
        $scope.$apply(function () {
            $scope.inputVal = barcode;

        });
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }


    $scope.onAddBarcode = function () {
        if ($("#area")[0].selectedIndex == 0) {
            navigator.notification.alert('יש לבחור מספר מנוי');
        }
        else {
            navigator.notification.alert('Sent Request To Server (Just For Development)');
        }
    };

});


