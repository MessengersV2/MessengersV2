/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />


scotchApp.controller('deliverController', function ($scope, $routeParams) {
    $scope.register = function () {
        alert('reg');
    };

    //#region JQuery On Document Ready
    $(document).ready(function () {
        $('.sigPad').signaturePad({ drawOnly: true });
        $('.sigPad').signaturePad({ lineWidth: 0 });
        $('.sigPad').signaturePad({ lineColour: '#FFFFFF' });
        $('.sigPad').signaturePad({ penColour: '#000000' });
        $("#sigDiv").prop('disabled', true);
        $("#takePic").prop('disabled', true);
    });
    //#endregion JQuery On Document Ready

    //#region General Variables
    var currentBarcode = '';
    var index = 0;
    var barcodes = [];
    var indexPic = 0;
    var pictures = [];
    var base64Signature = '';
    var countPictures = 0;
    var isBarcodeOk = false;
    var fixedWeight = "0";
    var originalWeight = "0";
    var isPalet = "0";
    var RQWGlobal = "0";
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
        var xml = CreateTablesXML();
        getKodMesiraTable(xml);
        if ($routeParams.originalWeight) {
            originalWeight = $routeParams.originalWeight;
            currentBarcode = $routeParams.barcode;
            fixedWeight = $routeParams.fixWeight;
            countPictures = $routeParams.countPictures;
            isPalet = $routeParams.isPalet;
            RQWGlobal = "1";
            var kodMesira = $routeParams.kodmesira;
            $(".area").val(kodMesira);
            $scope.inputVal = currentBarcode;
            isBarcodeOk = true;
        }


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
        if (isBarcodeOk) {
            $("#warpPopup").show();
        }
    };
    //#endregion On Open Popup

    //#region On X Click
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion On X Click

    //#region On Add Barcode

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


    function CreateXml(sig, mesira, barcode, ph1, ph2, ph3, isPalet, fixedWeight,RQW) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        var RQP = "0";
        if (ph1 != '' || ph2 != '' || ph3 != '') {
            RQP = "1";
        }
        //var RLSCODE = localStorage.getItem("RLSCODE");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
<soapenv:Header/>\
<soapenv:Body>\
<tem:ServerMessage>\
<!--Optional:-->\
<tem:xml><![CDATA[\
<DATA>\
<MSG><SYSTEMID>1</SYSTEMID>\
<HEADER>\
<MSGVER>1</MSGVER>\
<CODE>3</CODE>\
<SENDTIME>'+ date + '</SENDTIME>\
<GPS/>\
<USRKEY>'+ USRKEY + '</USRKEY>\
<DEVKEY>9999</DEVKEY>\
<VER>2</VER>\
</HEADER>\
<DATA>\
<ITEM>\
<ITEMID></ITEMID>\
<BC>'+ barcode + '</BC>\
<CRDT>'+date+'</CRDT>\
<DST>0</DST>\
<DELIV>'+ mesira + '</DELIV>\
<USR>'+ USR + '</USR>\
<MOKED>'+ MOKED + '</MOKED>\
<ACT>9</ACT>\
<MEM>0</MEM>\
<DEVKEY>9999</DEVKEY>\
<FN></FN>\
<LN></LN>\
<TYP>0</TYP>\
<DST></DST>\
<SIG>'+ sig + '</SIG>\
<PH1>'+ ph1 + '</PH1>\
<PH2>'+ ph2 + '</PH2>\
<PH3>'+ ph3 + '</PH3>\
<MEM></MEM>\
<RQ></RQ>\
<RQP>'+RQP+'</RQP>\
<RQW>'+RQW+'</RQW>\
<ORG>'+originalWeight+'</ORG>\
<CRT>'+fixedWeight+'</CRT>\
<PLT>'+isPalet+'</PLT>\
</ITEM>\
<BATCH></BATCH>\
</DATA>\
</MSG>\
</DATA>]]>\
</tem:xml>\
</tem:ServerMessage>\
</soapenv:Body>\
</soapenv:Envelope>';
        return xml;

    }



    $scope.onAddBarCode = function () {


    };
    //#endregion   On Add Barcode

    //#region On Send To Server Request





    $scope.onOkPressed = function () {
        if (countPictures != pictures.length) {
            navigator.notification.alert("לא צילמת מספיק תמונות");
        }
        else {
            if (!$routeParams.originalWeight) {
                currentBarcode = $(".packageinput2").val();
                if (currentBarcode == '') {
                    navigator.notification.alert('לא בחרת ברקוד');
                    return;
                }
            }

            //var barCode = '01145543708IL';
            var kodmesira = $(".area").val();
            if (kodmesira == "-1") {
                navigator.notification.alert('יש לבחור קוד מסירה');
            }
            else {
                var isOk = validateManaualCode(currentBarcode);
                if (isOk) {
                    var ph1 = '';
                    var ph2 = '';
                    var ph3 = '';
                    var sig = '';
                    if (base64Signature != null) {
                        sig = base64Signature;
                    }
                    for (var i = 0; i < pictures.length; i++) {
                        if (i == 0) {
                            ph1 = pictures[i];
                        }
                        else if (i == 1) {
                            ph2 = pictures[i];
                        }
                        else {
                            ph3 = pictures[i];
                        }
                    }
                    var xml = CreateXml(sig, kodmesira, currentBarcode, ph1, ph2, ph3, isPalet, fixedWeight, RQWGlobal);
                    makeDeliverRequest(xml);
                }
            }
        }


    };

    function makeDeliverRequest(xml) {
        var x = 10;
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
                                    isBarcodeOk = false;
                                    pictures = [];
                                    currentBarcode = '';
                                    $('.area').val('-1');
                                    base64Signature = '';
                                    $(".packageinput2").val('');
                                    $("#warpPopup").load(location.href + " #warpPopup");
                                    index = 0;
                                    barcodes = [];
                                    indexPic = 0;
                                    pictures = [];
                                    countPictures = 0;
                                    fixedWeight = "0";
                                    originalWeight = "0";
                                    isPalet = "0";
                                    RQWGlobal = "0";
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


    //#endregion AutoComplete JS

    //#region On Check Barcode
    function CreateValidateBarcodeXML(kodMesira, barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
        //        var date = "{0}";
        //        var USRKEY = "17";
        //        var USR = localStorage.getItem("USR");
        //        var MOKED = localStorage.getItem("MOKED");
        //        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        //   <soapenv:Header/>\
        //   <soapenv:Body>\
        //      <tem:ServerMessage>\
        //         <!--Optional:-->\
        //         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>999999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
        //      </tem:ServerMessage>\
        //   </soapenv:Body>\
        //</soapenv:Envelope>';

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:ServerMessage>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>999999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
      </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>'
        return xml;
    }

    $scope.onCheckBarCode = function () {
        //var barcode = $(".packageinput2").val();
        var barcode = 'EE135543749IL';
        if (barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == 17) {
            navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
        }
        else {
            if (validateManaualCode(barcode)) {
                var kodmesira = $(".area").val();
                if (kodmesira == "-1") {
                    navigator.notification.alert("יש לבחור קוד מסירה");
                }
                else {
                    var xml = CreateValidateBarcodeXML(kodmesira, barcode);
                    var t = 10;
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
                                   var result = xmlDoc.firstChild.firstChild.children[1].firstChild.innerHTML;
                                   var message = xmlDoc.firstChild.firstChild.children[1].children[1].innerHTML;
                                   if (result == "0") {

                                       isBarcodeOk = true;
                                       //var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML;
                                       var RQW = "1";
                                       var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                                       if (requestPics == "1") {
                                           var isph1 = xmlDoc.firstChild.firstChild.children[1].children[4].innerHTML;
                                           var isph2 = xmlDoc.firstChild.firstChild.children[1].children[5].innerHTML;
                                           var isph3 = xmlDoc.firstChild.firstChild.children[1].children[6].innerHTML;
                                           if (isph1 == "1") {
                                               countPictures++;
                                           }
                                           if (isph2 == "1") {
                                               countPictures++;
                                           }
                                           if (isph3 == "1") {
                                               countPictures++;
                                           }

                                           navigator.notification.alert("פריט מאושר");
                                       }
                                       if (RQW == "1") {
                                           var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;

                                           //If item is EMS
                                           if (barcode[0] == "E" && barcode[1] == "E") {
                                               ORG = "75623";
                                               location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures;
                                           }
                                           else {
                                               //for test:
                                               ORG = "75623";
                                               location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;

                                           }
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

            }
            else {

            }
        }
    };
    //#endregion 

    //#region Camera Handler.
    $scope.onTakePicture = function () {
        if (isBarcodeOk) {
            if (countPictures > pictures.length) {
                navigator.camera.getPicture(onCameraSuccess, onCameraFail,
                    {
                        quality: 40,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.DATA_URL,
                        saveToPhotoAlbum: false
                    });
            }
            else {
                navigator.notification.alert("כבר צילמת מספיק תמונות");
            }
        }
    };

    function onCameraSuccess(imageData) {
        console.log('get pictutre success');
        var image1 = document.getElementById('Image1');
        pictures[indexPic] = imageData;
        indexPic++;
        navigator.notification.alert("Got Picture!");
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

    //#region get kod mesira table
    function getKodMesiraTable(xml) {
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
                               var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                               $('#mesiraSelect').append($('<option>', {
                                   value: -1,
                                   text: 'מסירה \ אי מסירה'
                               }));
                               for (var i = 0; i < children.length; i++) {
                                   var child = children[i];
                                   var value = child.children[0].innerHTML;
                                   var text = child.children[1].innerHTML;
                                   $('#mesiraSelect').append($('<option>', {
                                       value: value,
                                       text: text
                                   }));

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

    //#region Create Tables XML
    function CreateTablesXML() {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>1</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }
    //#endregion

});

