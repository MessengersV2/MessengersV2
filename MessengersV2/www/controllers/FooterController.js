/*
scotchApp.controller('deliverController', function ($scope) {
    $scope.register = function () {
        alert('reg');
    };
    */
var serverUrl1 = "https://193.46.64.172:9464/WcfShlihimPhoneDocs";

var hasStat4Tasks = false;
var stat4TasksArray = [];
var stat4TasksArrayIndex = 0;

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

    function CreateXml() {
        var date = getCurrentDate();      
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");        

        var xml = 
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+XMLMETHOD+'>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>34</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
							    <DATA><USR>' + USR + '</USR>\
                                <MOKED>' + MOKED + '</MOKED>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+XMLMETHOD+'>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        console.log(xml);
        return xml;
    }
/*
*/
    function getAssigments() {        
        var xml = CreateXml();                
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
                                if (responseXML == null || responseXML == '') {
                                    location.href = "#/assignments_empty";
                                } else {
                                    var json = $.xml2json(responseXML);
                                    if (json.DATA.MSG.HEADER.CODE == 20) {
                                        createTasks(json);
                                    } else {
                                        var errorMessage = json.MSG.DATA.MSG.MSGTXT;
                                        navigator.notification.alert(errorMessage);
                                    }
                                }
                            }   //end if (data != null)                   
                        }).fail(function (jqXHR, textStatus, thrownError) {
                            navigator.notification.alert('Fail!');
                        });
    }

    function createTasks(JSONData) {
        var tasks = JSONData.DATA.MSG.DATA.TASKS.TASK;
        if (tasks == null || tasks.length == 0) {
            //navigator.notification.alert('אין משימות פתוחות כרגע');
            location.href = "#/assignments_empty";
        } else {
            //for (var i = tasks.length - 1; i >= 0; i--) {                        
            var tasksCounter = 0;
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].STAT == 1 || tasks[i].STAT == 2 || tasks[i].STAT == 3) {
                    if (tasks[i].Type == 1 || tasks[i].Type == 3) { //isuf
                        createTaskDiv(i, tasks[i].Type, tasks[i].STAT, tasks[i].new_contractid, tasks[i].new_contact_in_address, tasks[i].new_contact_main_phone, tasks[i].new_collection_from_hour, tasks[i].new_collection_to_hour, tasks[i].new_cityid, tasks[i].new_street, tasks[i].new_house_number, tasks[i].taskID.toString(), tasks[i].new_case_number);
                        tasksCounter++;
                    } else if (tasks[i].Type == 2)  //mesira
                    {
                        createTaskDiv(i, tasks[i].Type, tasks[i].STAT, tasks[i].new_account_number, tasks[i].new_contact_in_address, tasks[i].new_primary_telephone2, tasks[i].new_delivery_from_hour, tasks[i].new_delivery_until_hour, tasks[i].new_cityid, tasks[i].new_street, tasks[i].new_house_number, tasks[i].taskID.toString(), "");
                        tasksCounter++;
                    }
                } else {
                    if (tasks[i].STAT == 4) {
                        hasStat4Tasks = true;
                        stat4TasksArray[stat4TasksArrayIndex] = [];
                        stat4TasksArray[stat4TasksArrayIndex]["taskType"] = tasks[i].Type;
                        stat4TasksArray[stat4TasksArrayIndex]["taskId"] = tasks[i].taskID.toString();
                        stat4TasksArray[stat4TasksArrayIndex]["contactName"] = tasks[i].new_contact_in_address;
                        stat4TasksArray[stat4TasksArrayIndex]["city"] = tasks[i].new_cityid;
                        stat4TasksArray[stat4TasksArrayIndex]["street"] = tasks[i].new_street;
                        stat4TasksArray[stat4TasksArrayIndex]["houseNumber"] = tasks[i].new_house_number;
                        if (tasks[i].Type == 1 || tasks[i].Type == 3) { //isuf
                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasks[i].new_contractid;                            
                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasks[i].new_contact_main_phone;
                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasks[i].new_collection_from_hour;
                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasks[i].new_collection_to_hour;
                        } else // mesira
                        {
                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasks[i].new_account_number;                            
                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasks[i].new_primary_telephone2;
                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasks[i].new_delivery_from_hour;
                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasks[i].new_delivery_until_hour;
                        }
                                               
                        stat4TasksArrayIndex++;
                    }
                }
            }
            console.log('Handled ' + tasksCounter + ' pop-up tasks.');
            if (tasksCounter > 1) {
                $.magnificPopup.open({
                    items: {
                        src: $('#popupMsg'),
                        type: 'inline'
                    }
                });
                console.log('magnificPopup has been opened');
            } else if (hasStat4Tasks == true) {
                console.log('to assignments_all');
                //location.href = "#/assignments_all" + stat4TasksArray;
                location.href = "#/assignments_all";
            }
        }


        function createTaskDiv(index, taskType, taskStat, contractNumber, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, taskId, caseNumber) {
            var taskDescription, titleClass;
            if (taskType == 1 || taskType == 3) {
                taskDescription = 'איסוף';
                caseNumber = 'פנייה מספר ' + caseNumber;
                titleClass = 'newItempopTitleCollect';
            } else {
                taskDescription = 'מסירה';
                titleClass = 'newItempopTitle';
            }            
            var taskDiv = "taskDIV" + index;
            var subscriberName = getSubscriberName(contractNumber);
            var subscriberId = 'מנוי ' + contractNumber;                       
            console.log(index, taskType, taskStat, contractNumber, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, taskId, caseNumber);
            var divhtml = '<div id="' + taskDiv + '">';
            divhtml += '<div class="miyunPopup"><div class="shiyuchPopupInner4"><div class="closePop" id="closeBtn_' + index + '"><img src="images/closePopup.png" alt=""/></div>';
            divhtml += '<div class="' + titleClass + '">' + taskDescription + '<br><span>' + subscriberName + '</span></div>' + ' ' + subscriberId + '<br><strong>' + fromHour + ' - ' + toHour + '</strong>';
            divhtml += '<div>' + caseNumber + '</div>';
            divhtml += '<div class="assign_innerDetails"><div class="assign_innrtDetailsRight"><strong>' + city + '</strong><br>' + street + ' ' + houseNumber + '</div>';
            divhtml += '<div class="assign_innrtDetailsLeft"><strong>' + contactName + '</strong><br>' + contactPhoneNumber + '</div></div>';
            divhtml += '<form id="assignment_new_item" class="form_with_radio"><div class="popupradioBtns">';
            divhtml += '<div class="radioBtn"><input id="radio1_' + index + '" type="radio" name="radio_' + index + '" value="1"><label for="radio1_' + index + '"><span><span></span></span>אישור</label></div>';
            divhtml += '<div class="radioBtn"><input id="radio2_' + index + '" type="radio" name="radio_' + index + '" value="2" checked="checked"><label for="radio2_' + index + '"><span><span></span></span>דחיה</label></div></div>';
            divhtml += '<div class="BarcodeFields selectInput"><div class="selectInputfield"><select class="area" id="select' + index + '" name="area">';
            divhtml += '<option class="areainput" value="" disabled selected>סיבת הדחיה</option>';
            divhtml += '<option class="areainput" value="1">נמצא באזור חלוקה אחר</option>';
            divhtml += '<option class="areainput" value="2">לא שייך לאזור שלי</option>';
            divhtml += '<option class="areainput" value="3">לא אצליח להגיע בזמן</option>';
            divhtml += '<option class="areainput" value="4">אין מקום ברכב</option></select>';
            divhtml += '</div></div></form><div class="loginBtn" id="btn_' + index + '"><a href="#" class="popup_close_button">סיום</a></div></div>';            
            console.log("divhtml= " + divhtml);

            $('#popupMsg').append(divhtml);

            //bind "send" button
            $('#btn_' + index).on("click", function () {
                sendMSG21(index, taskId, taskDiv, taskStat);
            });

            //bind "close" button
            $('#closeBtn_' + index).on("click", function () {
                $('#' + taskDiv).remove();
            });
        }
    }

    function sendMSG21(index, taskId, taskDiv, taskStat) {

            console.log('sendMSG21 ' + index, taskId, taskDiv, taskStat);
            var date = getCurrentDate();            
            var userAction;
            if ($("#radio1_" + index).is(":checked")) {
                userAction = "accept";
            } else {
                userAction = "reject";
            }
            var rejectReason = $("#select" + index).val();
            if (rejectReason == null) {
                rejectReason = '';
            }
            var validated = true;
            if (userAction == "reject" && rejectReason == '') {
                validated = false;
                navigator.notification.alert('עליך לבחור סיבת דחייה');
            }

            if (validated) {
                var stat, reason = '';
                if (taskStat == 1 || taskStat == 2) { // in this case only, send message 21 with STAT=3
                    createMSG21(3, taskId, date);
                }

                var consoleMsg = '';
                if (userAction == "accept") { //accept task
                    stat = 4;
                    consoleMsg = 'The user accepted the task.';
                } else { //reject task
                    stat = 5;
                    reason = rejectReason;
                    consoleMsg = 'The user rejected the task, reject reason number is ' + reason + '.';
                }

                var xml =
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+XMLMETHOD+'>\
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
										<REASON>'+ reason + '</REASON>\
										<BC></BC><BCS></BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+XMLMETHOD+'>\
                </soapenv:Body>\
            </soapenv:Envelope>';
                console.log(xml);

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
                                            $('#' + taskDiv).remove();
                                            console.log('task ' + taskDiv + ' removed from the DOM');
                                            if ($('#popupMsg > div').length == 0) {
                                                $.magnificPopup.close();
                                                if (hasStat4Tasks == false) {
                                                    console.log('to assignments_empty');
                                                    window.history.back();
                                                    location.href = "#/assignments_empty";
                                                } else {
                                                    console.log('to assignments_all');
                                                    //location.href = "#/assignments_all" + stat4TasksArray;
                                                    location.href = "#/assignments_all";
                                                }
                                            } 
                                        } else {
                                            navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
                                        }
                                    }//end if (data != null)                                                   
                                }).fail(function (jqXHR, textStatus, thrownError) {
                                    navigator.notification.alert('Fail!');
                                });
            }
        }  
    
    function createMSG21(stat, taskId, date) {        
        var xml =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+XMLMETHOD+'>\
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
										<REASON></REASON>\
										<BC></BC>\
                                        <BCS></BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+XMLMETHOD+'>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        console.log(xml);

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
                                   if (JSONData.DATA.MSG.DATA.RESULT != 0) {
                                       navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
                                   }
                               } else {
                                   navigator.notification.alert('יש תקלה בשרת');
                               }//end if (data != null)                                                   
                           }).fail(function (jqXHR, textStatus, thrownError) {
                               navigator.notification.alert('Fail!');
                           });
    }
  