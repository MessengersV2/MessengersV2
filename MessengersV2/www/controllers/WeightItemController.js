scotchApp.controller('weightItemController', function ($scope, $routeParams) {
    var currentBarcode = '';
    var countPictures = 0;
    var isBarcodeOk = false;
    var fixedWeight = "0";
    var originalWeight;
    var kodMesira = '';

    //#region On Ready Angular
    angular.element(document).ready(function () {
        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            kodMesira = $routeParams.kodmesira;
            var kg = originalWeight[0] + originalWeight[1];
            var grm = originalWeight[2] + originalWeight[3] + originalWeight[4];
            $("#kgOrg").val(kg);
            $("#grmOrg").val(grm);
        }
        if ($routeParams.barcode) {
            currentBarcode = $routeParams.barcode;
            $(".packageinput").val(currentBarcode);
        }
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
       
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
        if (originalWeight != null) {
        if ($("#kgFixed").val() == '') {
            navigator.notification.alert('יש להזין ק"ג מתוקן');
        }
        else if ($("#grmFixed").val() == '') {
            navigator.notification.alert('יש להזין גרם מתוקן');
        }
        else {
            var MAX_EE_WT = localStorage.getItem("MAX_EE_WT");
            var select = $("#kgFixed").val() + $("#grmFixed").val();
            var selectToChecl = $("#kgFixed").val();
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
        else {
           
            if ($("#kgFixed").val() == '' || $("#grmFixed").val() == '') {
                navigator.notification.alert("חובה להכניס משקל מתוקן")
            }
            else {
                if ($("#kgOrg").val() == '' || $("#grmOrg").val() == '') {
                    navigator.notification.alert("חובה להכניס משקל מקורי")
                }
                else {
                    var fixedW = $("#kgFixed").val() + $("#grmFixed").val();
                    var originalW = $("#kgOrg").val() + $("#grmOrg").val();
                    var fixedToCheck = $("#kgFixed").val();
                    var MAX_EE_WT = localStorage.getItem("MAX_EE_WT");
                    if (MAX_EE_WT < fixedToCheck) {
                        navigator.notification.alert("משקל שהוקלד גדול מהמשקל המותר");
                    }
                    else {
                        if (fixedW.length > 5) {
                            fixedW = fixedW[0] + fixedW[1] + fixedW[2] + fixedW[3] + fixedW[4];
                        }
                        else {
                            while (fixedW.length != 5) {
                                fixedW = fixedW + "0";
                            }
                        }
                        var xml = CreateXml();
                        SendRequest(xml);
                    }

                }
            }
        }
    }

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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER>\
<DATA><ITEM><ITEMID></ITEMID><BC>'+ barcodeNormal + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><ACT>-1</ACT><TYP>0</TYP><MEM></MEM>\
<DEVKEY>9999</DEVKEY><RQ>1</RQ><ORG>'+ original + '</ORG><CRT>' + selectedFixed + '</CRT><PLT>0</PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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
                                    navigator.notification.alert('בקרת משקל בוצעה בהצלחה');
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


