scotchApp.controller('AssignmentsCollectController', function ($scope, $routeParams) {
    console.log('AssignmentsCollectController');
    var taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber;
    var barcodesArray = [];    
    
    angular.element(document).ready(function () {

   
        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('משימות - איסוף');
        });
        $("#footer").load("pages/footer.html");       
        $("#warpPopup").hide();

        taskId = $routeParams.taskId;
        contractId = $routeParams.contractId;
        contactName = $routeParams.contactName;
        
        contactPhoneNumber = $routeParams.contactPhoneNumber;
        fromHour = $routeParams.fromHour;
        toHour = $routeParams.toHour;
        city = $routeParams.city;
        street = $routeParams.street;
        houseNumber = $routeParams.houseNumber;
        newCaseNumber = $routeParams.newCaseNumber;

        $("#fromHourToHour").html(fromHour + ' - ' + toHour);
        $("#subscriberNum").html('מנוי ' + contractId);
        $("#subscriberName").html(' ' + getSubscriberName(contractId));
        $("#city").html(city);
        $("#address").html(street + ' ' + houseNumber);
        $("#name").html(contactName);
        $("#phone").html(contactPhoneNumber);
        var newCaseNumber = 'פנייה מספר ' + newCaseNumber;
        $("#NewCaseNumber").html(newCaseNumber);

        $("#headerTitle").html('משימות-איסוף');

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
    function playMP3() {
        var mp3URL = getMediaURL("sounds/scan.amr");
        var media = new Media(mp3URL, null, mediaError);
        media.play();
    }

    function getMediaURL(s) {
        if (device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
        return s;
    }

    function mediaError(e) {
        alert('Media Error');
        alert(JSON.stringify(e));
    }
    function onSuccess(barcode) {
        playMP3();
        //add the barcode to the barcodes array
        barcodesArray.push(barcode);        
        //update the scanned barcode to the screen
        $('#packageinput').val(barcode);
        //same behavior as clicking the plus icon
        sendMSG3(barcode);
    }

    function onFailure(data) {
        navigator.notification.alert('In cancelCallback');
    }
    //#endregion On Scan Barcode

    //#region On open popup
    $scope.open = function () {
        $("#warpPopup").show();
    };
    //#endregion

    //#region On Close X
    $scope.onXClick = function () {
        $("#warpPopup").hide();
    };
    //#endregion

    //#region on plus click
    function onPlusClick() {
        //send message 3 only if the user did not select "דחייה לאחר אישור" or "סיבת אי ביצוע"
        var isReject = $("#select[name=rejectReason]").val(); if (isReject == null) {isReject = '';}
        var isNoDo = $("#select[name=noDoReason]").val(); if (isNoDo == null) { isNoDo = '';}
        var currentBarCode = $('#packageinput').val();
        var isOk = validateManaualCode(currentBarCode);
        if (isOk) {
            if (isReject == "" && isNoDo == "") {
                sendMSG3(currentBarCode);
            }
            //update the list in the pop-up        
            $("#barcdoesList").append('<li>' + barcode + '</li>');
            //clear the input field in the screen
            $('#packageinput').val('');
        }
    }
    //#endregion

    //#region on finish click
    function onOkPressed() {
        if ($('#packageinput').val() != '') {
            navigator.notification.alert('יש ללחוץ על כפתור + ');
        } else {
            var isReject = $("#select[name=rejectReason]").val(); if (isReject == null) { isReject = ''; }
            var isNoDo = $("#select[name=noDoReason]").val(); if (isNoDo == null) { isNoDo = ''; }
            if (isReject == '' && isNoDo == '' && barcodesArray.length == 0) {
                navigator.notification.alert('לא נסרק פריט או לא נבחרה דחיה או סיבת אי ביצוע');
            } else {
                var xml = createMsg21(taskId, isReject, isNoDo, barcodesArray);
                $
                          .ajax(
                                        {
                                            url: serverUrl,
                                            dataType: "xml",
                                            type: "POST",
                                            async: false,
                                            contentType: "text/xml;charset=utf-8",
                                            headers: {
                                                "SOAPAction": SoapActionQA
                                            },
                                            crossDomain: true,
                                            data: xml,
                                            timeout: 30000 //30 seconds timeout
                                        }).done(function (data) {
                                            console.log(data);
                                            if (data != null) {
                                                var dataXML = new XMLSerializer().serializeToString(data);
                                                console.log(dataXML);
                                                var responseXML = $(dataXML).find("DataObject Data").text();
                                                var JSONData = $.xml2json(responseXML);
                                                if (JSONData.DATA.MSG.DATA.RESULT == 0) {
                                                    console.log('taskid ' + taskId + ' has been successfully reported.');
                                                    console.log(consoleMsg);
                                                    navigator.notification.alert('דווח בהצלחה');
                                                    //back to previous screen
                                                    window.history.back();
                                                } else {
                                                    navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
                                                }
                                            }//end if (data != null)                                                   
                                        }).fail(function (jqXHR, textStatus, thrownError) {
                                            navigator.notification.alert('Fail!');
                                        });
            }
        }
    }

    function createMsg21(taskId, isReject, isNoDo, barcodesArray) {        
        var date = getCurrentDate();
        var stat = "";
        var reason = "";
        if (isReject != '') {            
            stat = 10;
            reason = isReject;
        } else  if (isNoDo != '') {
            stat = 6;
            reason = isNoDo;
        } else {
            stat = 6;
            reason = 1;
        }
        var BCS;
        for (var i = 0; i < barcodesArray.length; i++) {
            BCS += barcodesArray[i] + ',';
        }
        //remove the last comma (,) from BCS
        BCS = BCS.substr(0, BCS.length-1);

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:ServerMessage>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
							    <DATA>\
                                    <STATUS>\
								        <TASKID>' + taskId + '</TASKID>\
										<DT>'+ date + '</DT>\
										<STAT>'+ stat + '</STAT>\
										<REASON>'+ reason +'</REASON>\
										<BC>'+ barcodesArray[0] + '</BC>\
                                        <BCS>'+ BCS +'</BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:ServerMessage>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        console.log(xml);
        return xml;
    }

    function sendMSG3(barcode) {       
       
        var xml = createMsg3Xml(barcode);
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
                                      console.log("MSG 3 successfully reported");
                                      //$("#deleteList").append('<li>' + currentBarCode + '</li>');                                      
                                      //$(".packageinput2").val('');
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

    function createMsg3Xml(barcode) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                     <soapenv:Header/>\
                        <soapenv:Body>\
                            <tem:'+XMLMETHOD+'>\
                            <!--Optional:-->\
                                <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM></MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP>0</RQP><RQW>0</RQW><ORG>0</ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
                            </tem:'+XMLMETHOD+'>\
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
    }
});