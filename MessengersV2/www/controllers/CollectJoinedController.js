scotchApp.controller('collect_joinedController', function ($scope, $routeParams) {

    var currentBarcode = '';
    var currentMem = '';
    var index = 0;
    $scope.names = [];
    //#region On Collect Pressed
    $scope.onCollect = function () {
        window.location.href = "#/collect";
    };
    //#endregion

    //#region On Ready Angular
    angular.element(document).ready(function () {
        $("#packageinput4").autocomplete({
            source: misparim
        });
        $("#packageinput4").autocomplete({
            select: function (a, b) {
                var result = b.item.value;
                var arr = result.split(",");
                var idNow = arr[1];
                idNow = idNow.trim();
                currentMem = idNow;
            }
        });
        $("#header").load("pages/header.html");
        $("#footer").load("pages/footer.html");
        $("#warpPopup").hide();
        $("warpPopup").load('deliverPopup.html');
        $("#warpPopup").hide();
        $.sidr('close', 'simple-menu');
        $('input').on('keyup', function (e) {
            var theEvent = e || window.event;
            var keyPressed = theEvent.keyCode || theEvent.which;
            if (keyPressed == 13) {
                Keyboard.hide();
            }
            return true;
        });


        var self = this;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        self.states = getMisparMaui();;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.newState = newState;
        function newState(state) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }



        
    });
    //#endregion

    //#region On Close X
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states,
            deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }









    var misparim = [];

 

    function getMisparMaui() {
 
        var xml = CreateTablesXML();
        var ee = 10;
        $.ajax({
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

                var result = xmlDoc.firstChild.innerHTML;
                var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
                for (i = 0; i < children.length; ++i) {
                    var id = children[i].children[0].innerHTML;
                    var name = children[i].children[1].innerHTML
                    misparim.push(name + " , " + id);   
                }
               return misparim;
            }
            else {


                navigator.notification.alert('יש תקלה בשרת');
            }

        }).fail(function (jqXHR, textStatus, thrownError) {
            navigator.notification.alert('Fail!');
        });
    }

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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+date+'</SENDTIME><GPS/><USRKEY>'+USRKEY+'</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>3</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
</tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';
        return xml;
    }

    //#region On Scan
    $scope.scan = function () {
        scan();
    };

    function scan() {
        cloudSky.zBar.scan({
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
            drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
        }, onSuccess, onFailure);
    }

    function onSuccess(barcode) {
        $scope.$apply(function () {
            $scope.inputVal = barcode;

        });
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }
    //#endregion

    //#region Make Request To Server

    function validateManaualCode(manualcode) {
        //must have exactly 13 chars
        //first 2 chars must be alphanumeric
        //next 9 chars must be numeric
        //last 2 chars must be letters
        var errorManualCode1 = 'מספר התווים בברקוד חייב להיות בדיוק 13';
        var errorManualCode2 = '2 התווים הראשונים חייבים להיות אלפא-נומריים';
        var errorManualCode3 = '9 התווים האמצעיים חייבים להיות נומריים';
        var errorManualCode4 = '2 התווים האחרונים חייבים להיות אותיות';
        var errorMessageToDisplay = '';
        var barcodeExpectedLength = 13;
        var validated = true;
        if (manualcode.length != barcodeExpectedLength)
        { errorMessageToDisplay = errorManualCode1; validated = false; }
        if (validated == true && (/[^a-zA-Z0-9]/.test(manualcode.substring(0, 2))))
        { errorMessageToDisplay = errorManualCode2; validated = false; }
        if (validated == true && isNaN(manualcode.substring(2, 11)))
        { errorMessageToDisplay = errorManualCode3; validated = false; }
        if (validated == true && !isNaN(manualcode.substring(11, 13)))
        { errorMessageToDisplay = errorManualCode4; validated = false; }
        if (validated == false) {
            console.log('manual barcode error: ' + errorMessageToDisplay);
            displayErrorMessage(errorMessageToDisplay);
        }
        return validated;
    }

    function displayErrorMessage(errorMessageToDisplay) {
        navigator.notification.alert(errorMessageToDisplay);
    }

    function CreateSaveItem4XML(barcode,misparManui) {
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
         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST>0</DST><DELIV>1</DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM>'+misparManui+'</MEM><DEVKEY>9999</DEVKEY><FN>klj</FN><LN>jkl</LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><ORG></ORG><CRT></CRT><PLT></PLT></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
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

    $scope.open = function () {
        $("#warpPopup").show();
    };


    $scope.onAddBarcode = function () {
        if (currentMem == '') {
            navigator.notification.alert('יש לבחור מספר מנוי');
        }
        currentBarCode = $(".packageinput2").val();
        var isOk = validateManaualCode(currentBarCode);
        if (isOk) {
            if (currentBarCode.substring(0, 2) == "51" && currentBarCode.substring(currentBarCode.length - 2, currentBarCode.length) == 17) {
                navigator.notification.alert('איסוף פריט מסוג 51-17 יש לבצע בתפריט איסוף מחנות בלבד');
            }
            else{
            var xml = CreateSaveItem4XML(currentBarCode,currentMem);
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
                              index++;
                              $("#deleteList").append('<li>' + currentBarCode + '</li>');
                              $('#barcodeCount').text(index);
                              $(".packageinput2").val('');
                              currentBarCode = '';
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
        else
        {
            
        }
    };
 

    //#endregion



});




