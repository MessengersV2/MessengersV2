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
        if(originalWeghit != null)
        {
            var select = "0";
            isPalet = "1";
            var currentBarcode = $("#packageinput").val();
            var xml = CreateXml(currentBarcode);
            SendRequest(xml);
        }
        else{
            var currentBarcode = $("#packageinput").val();
            var xml = CreateXml(currentBarcode);
            SendRequest(xml);
        }
    }
  
     $scope.$watch('value', function (value) {
        if (value == 2) {
            if (barcode != '' && originalWeghit != '') {

            }
            if (originalWeghit != "") {
                var select = "0";
                isPalet = "0";
                location.href = "#/weightNormal/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;
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
        $('.packageinput').val(barcode);
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

    //#region Create Xml
    function CreateXml(barcodeNormal) {
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
<DEVKEY>9999</DEVKEY><RQ>1</RQ><ORG></ORG><CRT></CRT><PLT>1</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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
                                    var select = "0";
                                    location.href = "#/mesira_takin/originalWeight/" + originalWeghit + "/barcode/" + barcode + "/fixedWeight/" + select + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;
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





