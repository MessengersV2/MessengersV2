scotchApp.controller('weightPalletController', function ($scope, $routeParams) {

    var originalWeghit = "";
    var barcode = "";
    var kodmesira = "";
    var countPictures = "";
    var isPalet = "";

    angular.element(document).ready(function () {
        originalWeghit = $routeParams.originalWeghit;
        barcode = $routeParams.barcode;
        kodmesira = $routeParams.kodmesira;
        countPictures = $routeParams.countPictures;
        isPalet = $routeParams.isPalet;
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
    });

    $scope.onOk = function () {
        var select = "0";
        isPalet = "1";
        location.href = "#/deliver/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;

    }

});





