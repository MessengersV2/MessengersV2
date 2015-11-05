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


        $.sidr('close', 'simple-menu');
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST>0</DST><DELIV>1</DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><ACT>3</ACT><MEM>0</MEM><DEVKEY>9999</DEVKEY><FN>klj</FN><LN>jkl</LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><ORG></ORG><CRT></CRT><PLT></PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
         </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    $scope.onAddBarcode = function () {
        if (currentBarCode == '') {
            navigator.notification.alert('יש לסרוק ברקוד');
        }
        else {
            var xml = CreateSaveItem4XML(currentBarCode);
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
                              currentBarCode = '';
                              $("#deleteList").append('<li>' + currentBarcode + '</li>');
                              $(".packageinput").val('');
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
        $scope.inputVal = '';
    };

});


