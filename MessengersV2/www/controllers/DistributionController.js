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


    //#region JQuery On Document Ready

    //#endregion JQuery On Document Ready



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
        $('.packageinput2').val(barcode);
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

        $('input').on('keyup', function (e) {
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

        currentBarcode = $('.packageinput2').val();
        var isOk = validateManaualCode(currentBarcode);
        if(isOk) {
            var soapMessage = CreateSaveItem4XML(currentBarcode);
            var x = 10;
            $.ajax(
                    {
                        url: serverUrl,
                        dataType: "xml",
                        //dataType: 'json',
                        type: "POST",
                        async: false,
                        contentType: "text/xml;charset=utf-8",
                        headers: {
                            "SOAPAction": "http://tempuri.org/IService1/ServerMessage"
                        },
                        crossDomain: true,
                        data: soapMessage,
                        timeout: 30000 //30 seconds timeout
                    }).done(function (data) {
                        if (data != null) {
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                            var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                            var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                            if (result == "0") {
                                barcodes[index] = currentBarcode;
                                index++;
                                $("#deleteList").append('<li>' + currentBarcode + '</li>');
                                $('#barcodeCount').text(index);
                                $(".packageinput2").val('');
                                currentBarcode = '';
                            }
                            else {
                                navigator.notification.alert(message);
                            }
                        }
                        else {


                            navigator.notification.alert('יש תקלה בשרת');
                        }

                    }).fail(function (jqXHR, textStatus, thrownError) {
                        navigator.notification.alert('Fail!');
                    });
        }
    };

    function getCurrentDate() {
        //04/11/2015 14:53:34
        var date = new Date();
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        if (day < 10) {
            day = "0" + day;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        var str = day + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
        return str;
    };

    function CreateSaveItem4XML(barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:ServerMessage>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST>0</DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>4</ACT><MEM>0</MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><ORG></ORG><CRT></CRT><PLT></PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
         </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    $scope.onOkPressed = function () {
        $('#barcodeCount').text(0);
          index = 0;
    };

    $scope.onRegister = function () {
        location.href = "#/register"
    };

    //###########################################################  On Clicks Finish ###########################################################






});

