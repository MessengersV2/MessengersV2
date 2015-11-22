scotchApp.controller('weightNormalController', function ($scope, $routeParams) {

    //#region Global Vars
    var originalWeghit = "";
    var barcode = "";
    var kodmesira = "";
    var countPictures = "";
    var isPalet = "";
    var fixedWeight = '';
    //#endregion

    //#region On Angular Ready
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
    //#endregion

    //#region on Radio button changed
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
    //#endregion

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
        if (barcode[0] == "E" && barcode[1] == "E") {

        }
        $('#packageinput').val(barcode);
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }
    //#endregion On Scan Barcode

    function getCurrentDate() {
        //04/11/2015 14:53:34
        var date = new Date();
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var str = day + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return str;
    };

    //#region On Ok Pressed
    $scope.onOkPressed = function () {

        if (barcode != '' && originalWeghit != '') {
            var select = $(".area").val();
            fixedWeight = select;
            if (select == "-1") {
                navigator.notification.alert("יש לבחור משקל מתוקן");
            }
            else {
                var selectedFixed = $(".area").val();
                var original = $(".packageinput4").val();
                if (original == '') {
                    original = "0";
                }
                var xml = CreateXml(barcode, selectedFixed, original);
                SendRequest(xml);
            }
        }
        else {
            var barcodeNormal = $("#packageinput").val();
            if (barcodeNormal[0] == "E" && barcodeNormal[1] == "E") {
                location.href = "#/weightItem/barcode/" + barcodeNormal;
            }
            else {
                var selectedFixed = $(".area").val();
                var original = $(".packageinput4").val();
                if (original == '') {
                    original = "0";
                }
                var xml = CreateXml(barcodeNormal, selectedFixed, original);
                SendRequest(xml);
            }

        }
    };
    //#endregion

    //#region Create Xml
    function CreateXml(barcodeNormal, selectedFixed, original) {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>'+date+'</SENDTIME><GPS/><USRKEY>'+USRKEY+'</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER>\
<DATA><ITEM><ITEMID></ITEMID><BC>'+barcodeNormal+'</BC><CRDT>'+date+'</CRDT><DST></DST><DELIV></DELIV><USR>'+USR+'</USR><MOKED>'+MOKED+'</MOKED><ACT>-1</ACT><TYP>0</TYP><MEM></MEM>\
<DEVKEY>9999</DEVKEY><RQ>1</RQ><ORG>'+original+'</ORG><CRT>'+selectedFixed+'</CRT><PLT>0</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
      </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>'

        return xml;
    }
    //#endregion

    //#region SendRequest
    function SendRequest(xml) {
        $
          .ajax(
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
                            data: xml,
                            timeout: 30000 //30 seconds timeout
                        }).done(function (data) {
                            if (data != null) {
                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
                                var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                                var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                                if (result == "0") {
                                    if (barcode != '' && originalWeghit != '') {
                                        location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + fixedWeight + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;

                                    }
                                    else {
                                        navigator.notification.alert('בקרת משקל בוצעה בהצלחה');
                                    }
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
    //#endregion

});


