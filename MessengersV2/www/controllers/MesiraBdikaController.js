

scotchApp.controller('deliverController', function ($scope, $routeParams) {


    var countPictures = 0;
    var isPalet = "0";

 


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


    //#region On Check Barcode
    function CreateValidateBarcodeXML(kodMesira, barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");
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
        var barcode = '01156547698IL';
        if (barcode.substring(0, 2) == "51" && barcode.substring(barcode.length - 2, barcode.length) == 17) {
            navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
        }
        else {
            if (validateManaualCode(barcode)) {
                var kodmesira = $(".area").val() + "," +  $(".area option:selected").text();
                if (kodmesira == "-1") {
                    navigator.notification.alert("יש לבחור קוד מסירה");
                }
                else {
                    var kodMesiraValue = kodmesira.split(',')[0];
                    var xml = CreateValidateBarcodeXML(kodMesiraValue, barcode);
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
                                   if (result == "0") {
                                       var requestPics = xmlDoc.firstChild.firstChild.children[1].children[9].innerHTML;
                                       var RQW = xmlDoc.firstChild.firstChild.children[1].children[8].innerHTML
                                       //If Images Are Requested
                                       requestPics = "1";
                                       if (requestPics == "1") {
                                           countPictures = countAmountOfPictures(xmlDoc, countPictures);
                                           countPictures = "1";
                                        }

                                       //If weight is requested
                                       RQW = "1";
                                       if (RQW == "1") {
                                           var ORG = xmlDoc.firstChild.firstChild.children[1].children[3].innerHTML;
                                           //If item is EMS
                                           if (barcode[0] == "E" && barcode[1] == "E") {
                                               ORG = 34675
                                               GoToEms(ORG, barcode, kodmesira, countPictures);
                                           }
                                           else {
                                               ORG = 34675
                                               GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet);
                                           }
                                       }

                                   }
                                   else {
                                       var message = xmlDoc.childNodes[0].firstChild.children[1].children[1].innerHTML;
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

    function countAmountOfPictures(xmlDoc, countPictures) {
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
        return countPictures;
    }

    function GoToEms(ORG, barcode, kodmesira, countPictures) {
        location.href = "#/weightItem/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures;
    }

    function GoToRegularWeight(ORG, barcode, kodmesira, countPictures, isPalet) {
        location.href = "#/weightNormal/originalWeight/" + ORG + "/barcode/" + barcode + "/kodmesira/" + kodmesira + "/countPictures/" + countPictures + "/isPalet/" + isPalet;

    }


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

