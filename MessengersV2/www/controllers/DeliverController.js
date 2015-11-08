/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliver.html" />
/// <reference path="../pages/deliverPopup.html" />
/// <reference path="../pages/deliverPopup.html" />


scotchApp.controller('deliverController', function ($scope) {
    $scope.register = function () {
        alert('reg');
    };

    //#region JQuery On Document Ready
    $(document).ready(function () {
        $('.sigPad').signaturePad({ drawOnly: true });
        $('.sigPad').signaturePad({ lineWidth: 0 });
        $('.sigPad').signaturePad({ lineColour: '#FFFFFF' });
        $('.sigPad').signaturePad({ penColour: '#000000' });

    });
    //#endregion JQuery On Document Ready

    //#region General Variables
    var currentBarcode = '';
    var index = 0;
    var barcodes = [];
    var indexPic = 0;
    var pictures = [];
    var base64Signature = '';
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
        $("#warpPopup").show();
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


    function CreateXml(sig,mesira, barcode, ph1, ph2, ph3) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
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
<CRDT>03/10/2012 09:43:52</CRDT>\
<DST>0</DST>\
<DELIV>'+ mesira + '</DELIV>\
<USR>'+ USR + '</USR>\
<MOKED>'+ MOKED + '</MOKED>\
<ACT>9</ACT>\
<MEM>0</MEM>\
<DEVKEY>9999</DEVKEY>\
<FN>klj</FN>\
<LN>jkl</LN>\
<SIG>'+sig+'</SIG>\
<PH1>'+ ph1 + '</PH1>\
<PH2>'+ ph2 + '</PH2>\
<PH3>'+ ph3 + '</PH3>\
<MEM></MEM>\
<RQ></RQ>\
<ORG></ORG>\
<CRT></CRT>\
<PLT></PLT>\
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
        var mesira = $(".area").val();
        if (mesira == "-1") {
            navigator.notification.alert('יש לבחור קוד מסירה');
        }
        else {
            if (currentBarcode == '') {
                navigator.notification.alert('יש לסרוק ברקוד');
            }
            else {
                var ph1 = '';
                var ph2 = '';
                var ph3 = '';
                var sig = '';
                if (base64Signature != null) {
                    sig = base64Signature;
                }
                for(var i = 0;i <pictures.length;i++){
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
                var xml = CreateXml(sig,mesira, currentBarcode, ph1, ph2, ph3);
                makeDeliverRequest(xml);
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
                                     pictures = [];
                                     currentBarcode = '';
                                     $('.area').val('-1');
                                     base64Signature = '';
                                     $(".packageinput2").val('');
                                     $("#warpPopup").load(location.href + " #warpPopup");
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






    //#region Camera Handler.
    $scope.onTakePicture = function () {
        if (indexPic >= 2) {
            navigator.notification.alert('נלקחו כבר 3 תמונות');
        }
        else {
            navigator.camera.getPicture(onCameraSuccess, onCameraFail,
                {
                    quality: 40,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.DATA_URL,
                    saveToPhotoAlbum: false
                });
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
});

