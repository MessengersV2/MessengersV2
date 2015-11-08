scotchApp.controller('collectController', function ($scope, $routeParams) {

    //************************************************************ On Clicks Start ************************************************************
    $scope.scan = function () {
        scan();
    };


    $scope.onCollectAll = function () {
        location.href = "#/collect_joined";
    };

    //############################################################ On Clicks Finish ############################################################

    var currentBarCode = '';


    //************************************************************ On document Ready Start ************************************************************

    angular.element(document).ready(function () {
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $("#warpPopup").hide();
        $("warpPopup").load('deliverPopup.html');
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


    //############################################################ On document Ready Finish ############################################################

    //************************************************************ Scan Start ************************************************************
    function scan() {
        cloudSky.zBar.scan({
            camera: "back", // defaults to "back"
            flash: "on" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    }

    function onSuccess(barcode) {
        currentBarCode = barcode;
        $scope.$apply(function () {
            $scope.inputVal = barcode;
        });
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }
    //############################################################ Scan Finish ############################################################

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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST>0</DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM>0</MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><ORG></ORG><CRT></CRT><PLT></PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
         </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

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

    function isLetter(str) {
        if(str.length === 1 && str.match(/[a-z]/i))
        {
        return true;
        }
        else
        {
        return false
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
rCode = $scope.inputVal;

    $scope.onAddBarcode = function () {
        currentBa
   navigator.notification.alert('אורך ברקוד אינו תקין, חייב להיות 13 תווים');
            return;
        }

        else {
            var isletter = isLetter(currentBarCode[0]);
            var isnum = isNumeric(currentBarCode[0]);
            if (!isnum && !is(currentBarCode[1]);
            isnum = isNumeric(currentBarCode[1]);
                if (!isnum letter) {
                  navigator.notification.alert('שני תווים ראשונים צריכים להיות אלפא-נומרים.');
                    return;
            }
            isletter = isletter|| !isletter) {
                    navigator.notification.alert('שני תווים ראשונים צריכים להיות אלפא-נומרים.');
                    return;
                }
        }
        if (currentBarCode.length != 13) {
         

        if (currentBarCode == '') {
            navigator.notification.alert('יש לסרוק ברקוד');
            return;
        }

        else {
            if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == 17) {
                navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
                return;
            }
            else {


                var xml = CreateSaveItem4XML(currentBarCode);
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
                          data: xml,
                          timeout: 30000 //30 seconds timeout
                      }).done(function (data) {
                          if (data != null) {
                              var parser = new DOMParser();
                              var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                              var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                              var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                              if (result == "0") {
                                  currentBarCode = '';
                                  $(".packageinput").val('');
                                  $scope.inputVal = '';
                                  navigator.notification.alert('פריט נאסף בהצלחה');
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

    };

});


