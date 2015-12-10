scotchApp.controller('assignmentsAllController', function ($scope, $routeParams) {

    //$scope.test = function (taskId) {
    //    console.log('test ' + taskId);
    //    conole.log('stat4TasksArrayIndex= ' + stat4TasksArrayIndex);
    //    var temp = $compile(btnhtml)($scope);
    //    location.href = "#/assigments_empty";
    //}
    //var hasStat4Tasks = [];

    angular.element(document).ready(function () {

        $("#header").load("pages/header.html", function () {
            var tt = $('#header').find('#headerText');
            tt.text('משימות');
        });
        $("#footer").load("pages/footer.html");

        $("#tasksList").html('');
        var stat4TasksArrayIndex = 0;
        var stat4TasksArray = [];

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

        function createTasks(JSONData) {
            var tasks = JSONData.DATA.MSG.DATA.TASKS.TASK;
            if (tasks == null || tasks.length == 0) {
                //navigator.notification.alert('אין משימות פתוחות כרגע');
                location.href = "#/assignments_empty";
            } else {
                for (var i = 0; i < tasks.length; i++) {
                    if (tasks[i].STAT == 4) {
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
                            stat4TasksArray[stat4TasksArrayIndex]["newCaseNumber"] = tasks[i].new_case_number;
                        } else if (tasks[i].Type == 2)// mesira
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
        }
        console.log('There are total ' + stat4TasksArray.length + ' tasks to display');
        //sort the tasks according to the required logic        
        var tasksInDelay = [];
        var tasksInDelayIndex = 0;
        var tasksCloseToDo = [];
        var tasksCloseToDoIndex = 0;
        var regularTasks = [];
        var regularTasksIndex = 0;

        var currentTime = new Date();

        for (var i = 0; i < stat4TasksArray.length; i++) {
            var taskTotime = createDate(stat4TasksArray[i].toHour.substring(0, 2), stat4TasksArray[i].toHour.substring(3, 5));
            var taskFromTime = createDate(stat4TasksArray[i].fromHour.substring(0, 2), stat4TasksArray[i].fromHour.substring(3, 5));
            var diffInMinutesToTime = getMinutesBetweenDates(currentTime, taskTotime);
            if (diffInMinutesToTime < 0) {
                tasksInDelay[tasksInDelayIndex] = [];

                tasksInDelay[tasksInDelayIndex]["taskType"] = stat4TasksArray[i].taskType;
                tasksInDelay[tasksInDelayIndex]["contractId"] = stat4TasksArray[i].contractId;
                tasksInDelay[tasksInDelayIndex]["contactName"] = stat4TasksArray[i].contactName;
                tasksInDelay[tasksInDelayIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
                tasksInDelay[tasksInDelayIndex]["fromHour"] = stat4TasksArray[i].fromHour;
                tasksInDelay[tasksInDelayIndex]["toHour"] = stat4TasksArray[i].toHour;
                tasksInDelay[tasksInDelayIndex]["city"] = stat4TasksArray[i].city;
                tasksInDelay[tasksInDelayIndex]["street"] = stat4TasksArray[i].street;
                tasksInDelay[tasksInDelayIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
                tasksInDelay[tasksInDelayIndex]["taskId"] = stat4TasksArray[i].taskId;
                tasksInDelay[tasksInDelayIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;
                tasksInDelay[tasksInDelayIndex]["diffTime"] = Math.abs(diffInMinutesToTime);

                tasksInDelayIndex++;
            } else {
                var diffInMinutesFromTime = getMinutesBetweenDates(currentTime, taskFromTime);
                if (diffInMinutesFromTime < localStorage.getItem("TASK_CLOSED2EXECUTION_TIME")) {
                    tasksCloseToDo[tasksCloseToDoIndex] = [];

                    tasksCloseToDo[tasksCloseToDoIndex]["taskType"] = stat4TasksArray[i].taskType;
                    tasksCloseToDo[tasksCloseToDoIndex]["contractId"] = stat4TasksArray[i].contractId;
                    tasksCloseToDo[tasksCloseToDoIndex]["contactName"] = stat4TasksArray[i].contactName;
                    tasksCloseToDo[tasksCloseToDoIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
                    tasksCloseToDo[tasksCloseToDoIndex]["fromHour"] = stat4TasksArray[i].fromHour;
                    tasksCloseToDo[tasksCloseToDoIndex]["toHour"] = stat4TasksArray[i].toHour;
                    tasksCloseToDo[tasksCloseToDoIndex]["city"] = stat4TasksArray[i].city;
                    tasksCloseToDo[tasksCloseToDoIndex]["street"] = stat4TasksArray[i].street;
                    tasksCloseToDo[tasksCloseToDoIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
                    tasksCloseToDo[tasksCloseToDoIndex]["taskId"] = stat4TasksArray[i].taskId;
                    tasksCloseToDo[tasksCloseToDoIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;
                    if (diffInMinutesToTime < 0) {
                        diffInMinutesToTime = diffInMinutesToTime * (-1);
                    }
                    tasksCloseToDo[tasksCloseToDoIndex].diffTime = diffInMinutesToTime;

                    tasksCloseToDoIndex++;
                } else {
                    regularTasks[regularTasksIndex] = [];

                    regularTasks[regularTasksIndex]["taskType"] = stat4TasksArray[i].taskType;
                    regularTasks[regularTasksIndex]["contractId"] = stat4TasksArray[i].contractId;
                    regularTasks[regularTasksIndex]["contactName"] = stat4TasksArray[i].contactName;
                    regularTasks[regularTasksIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
                    regularTasks[regularTasksIndex]["fromHour"] = stat4TasksArray[i].fromHour;
                    regularTasks[regularTasksIndex]["toHour"] = stat4TasksArray[i].toHour;
                    regularTasks[regularTasksIndex]["city"] = stat4TasksArray[i].city;
                    regularTasks[regularTasksIndex]["street"] = stat4TasksArray[i].street;
                    regularTasks[regularTasksIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
                    regularTasks[regularTasksIndex]["taskId"] = stat4TasksArray[i].taskId;
                    regularTasks[regularTasksIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;

                    regularTasksIndex++;
                }
            }
        }

        //sort tasksInDelay and takskCloseToDo according to diff time (no need to sort regularTasks)        
        if (tasksInDelay.length > 0) {
            tasksInDelay.sort(function (a, b) { return b.diffTime - a.diffTime; })
        }
        if (tasksCloseToDo.length > 0) {
            tasksCloseToDo.sort(function (a, b) { return b.diffTime - a.diffTime; })
        }

        //loop over the tasks and add them to the screen (all the tasks have stat 4)                       
        for (var i = 0; i < tasksInDelay.length; i++) {
            var taskTypeClass;
            if (tasksInDelay[i].taskType == 1 || tasksInDelay[i].taskType == 3) {
                taskTypeClass = 'collect';
            } else {
                taskTypeClass = 'deliver';
            }

            var classRedColor = "";
            if ((tasksInDelay[i].diffTime > localStorage.getItem("TASK_LAGGED_TIME"))) {
                classRedColor = "red";
            }

            var htmltasksInDelay = '';
            htmltasksInDelay += '<li><div class="assign_innerTableRight"><div class="' + classRedColor + ' ' + taskTypeClass + '">' + tasksInDelay[i].fromHour + ' - ' + tasksInDelay[i].toHour + '</div></div>';
            htmltasksInDelay += '<div class="assign_innrtTableLeft"><strong>' + tasksInDelay[i].city + '</strong><br>' + tasksInDelay[i].street + ' ' + tasksInDelay[i].houseNumber + '</div>';
            htmltasksInDelay += '<div class="assign_innerTableLeft2" id="assignAddInDelay_' + i + '"><a href="#"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

            $("#tasksList").append(htmltasksInDelay);

            //bind "+" button - for isuf 
            if (tasksInDelay[i].taskType == 1 || tasksInDelay[i].taskType == 3) {                
                $(document).on("click", '#assignAddInDelay_' + i, function () {                    
                    toAssignments_collect(tasksInDelay[i].taskId.toString(), tasksInDelay[i].contractId.toString(), tasksInDelay[i].contactName.toString(), tasksInDelay[i].contactPhoneNumber.toString(), tasksInDelay[i].fromHour.toString(), tasksInDelay[i].toHour.toString(), tasksInDelay[i].city.toString(), tasksInDelay[i].street.toString(), tasksInDelay[i].houseNumber.toString(), tasksInDelay[i].newCaseNumber.toString());
                });
            }
        }

        console.log('There are ' + tasksInDelay.length + ' tasks in delay');

        for (var i = 0; i < tasksCloseToDo.length; i++) {
            var taskTypeClass;
            if (tasksCloseToDo[i].taskType == 1 || tasksCloseToDo[i].taskType == 3) {
                taskTypeClass = 'collect';
            } else {
                taskTypeClass = 'deliver';
            }

            var htmltasksCloseToDo = '';
            htmltasksCloseToDo += '<li><div class="assign_innerTableRight"><div class="orange ' + taskTypeClass + '">' + tasksCloseToDo[i].fromHour + ' - ' + tasksCloseToDo[i].toHour + '</div></div>';
            htmltasksCloseToDo += '<div class="assign_innrtTableLeft"><strong>' + tasksCloseToDo[i].city + '</strong><br>' + tasksCloseToDo[i].street + ' ' + tasksCloseToDo[i].houseNumber + '</div>';
            htmltasksCloseToDo += '<div class="assign_innerTableLeft2" id="assignAddCloseToDo_' + i + '"><a href="#"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

            $("#tasksList").append(htmltasksCloseToDo);

            //bind "+" button - for isuf
            if (tasksCloseToDo[i].taskType == 1 || tasksCloseToDo[i].taskType == 3) {               
                $(document).on("click", '#assignAddCloseToDo_' + i, function () {                   
                    toAssignments_collect(tasksCloseToDo[i].taskId.toString(), tasksCloseToDo[i].contractId.toString(), tasksCloseToDo[i].contactName.toString(), tasksCloseToDo[i].contactPhoneNumber.toString(), tasksCloseToDo[i].fromHour.toString(), tasksCloseToDo[i].toHour.toString(), tasksCloseToDo[i].city.toString(), tasksCloseToDo[i].street.toString(), tasksCloseToDo[i].houseNumber.toString(), tasksCloseToDo[i].newCaseNumber.toString());
                });
            }
        }

        console.log('There are ' + tasksCloseToDo.length + ' tasks close to do');

        for (var i = 0; i < regularTasks.length; i++) {
            var taskTypeClass;
            if (regularTasks[i].taskType == 1 || regularTasks[i].taskType == 3) {
                taskTypeClass = 'collect';
            } else {
                taskTypeClass = 'deliver';
            }

            var htmlregularTasks = '';
            htmlregularTasks += '<li><div class="assign_innerTableRight"><div class="' + taskTypeClass + '">' + regularTasks[i].fromHour + ' - ' + regularTasks[i].toHour + '</div></div>';
            htmlregularTasks += '<div class="assign_innrtTableLeft"><strong>' + regularTasks[i].city + '</strong><br>' + regularTasks[i].street + ' ' + regularTasks[i].houseNumber + '</div>';
            htmlregularTasks += '<div class="assign_innerTableLeft2" id="assignAddregularTasks_' + i + '"><a href="#"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

            $("#tasksList").append(htmlregularTasks);

            //bind "+" button - for isuf
            if (regularTasks[i].taskType == 1 || regularTasks[i].taskType == 3) {                
                $(document).on("click", '#assignAddregularTasks_' + i, function () {                    
                    toAssignments_collect(regularTasks[i].taskId.toString(), regularTasks[i].contractId.toString(), regularTasks[i].contactName.toString(), regularTasks[i].contactPhoneNumber.toString(), regularTasks[i].fromHour.toString(), regularTasks[i].toHour.toString(), regularTasks[i].city.toString(), regularTasks[i].street.toString(), regularTasks[i].houseNumber.toString(), regularTasks[i].newCaseNumber.toString());
                });
            }
        }

        console.log('There are ' + regularTasks.length + ' regular tasks');
        console.log('done building task for assignmentsAll');
    });


    function toAssignments_collect(taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber) {
        console.log('toAssignments_collect ' + taskId + ' ' + contractId + ' ' + contactName + ' ' + contactPhoneNumber + ' ' + fromHour + ' ' + toHour + ' ' + city + ' ' + street + ' ' + houseNumber + ' ' + newCaseNumber);
        location.href = "#/assignments_collect/taskId/" + taskId + "/contractId/" + contractId + "/contactName/" + contactName + "/contactPhoneNumber/" + contactPhoneNumber + "/fromHour/" + fromHour + "/toHour/" + toHour + "/city/" + city + "/street/" + street + "/houseNumber/" + houseNumber + "/newCaseNumber/" + newCaseNumber;
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

    function getMinutesBetweenDates(startDate, endDate) {
        console.log(startDate, endDate);
        var diff = endDate.getTime() - startDate.getTime();
        return Math.round(diff / 60000);
    }

    function createDate(hours, minutes) {
        var date = new Date();
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }

        var str = new Date(date.getFullYear(), date.getMonth(), day, hours, minutes, 0, 0);
        return str;
    }

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
});