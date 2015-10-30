scotchApp.controller('collectController', function ($scope, $routeParams) {

    //************************************************************ On Clicks Start ************************************************************
    $scope.scan = function () {
        scan();
    };


    $scope.onCollectAll = function () {
        window.location.href = "#/collect_joined";
    };

    //############################################################ On Clicks Finish ############################################################



    //************************************************************ On document Ready Start ************************************************************


    angular.element(document).ready(function () {


        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");


        $.sidr('close', 'simple-menu');
    });


    //############################################################ On document Ready Finish ############################################################




    //************************************************************ Scan Start ************************************************************
    function scan() {
        cloudSky.zBar.scan({
            camera: "back", // defaults to "back"
            flash: "on"||"auto", // defaults to "auto". See Quirks
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
    //############################################################ Scan Finish ############################################################



    $scope.onAddBarcode = function () {
        //navigator.notification.alert('Sent Request To Server.');
        $scope.inputVal = '';
    };

});


