scotchApp.controller('loginController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.login = function () {
        login();
    };
    var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";

    function createLoginXML(userId, password) {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">   <soapenv:Header/>   <soapenv:Body>      <tem:ServerMessage>         <!--Optional:-->         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>1</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER><DATA><USERID>' + userId + '</USERID><PWD>' + password + '</PWD></DATA></MSG></DATA>]]></tem:xml>      </tem:ServerMessage>   </soapenv:Body></soapenv:Envelope>';
        console.log('XML SENDING TO LOGIN: ' + xml);
        return xml;
    }


    function createBalanceXML(USRKEY, USR) {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">   <soapenv:Header/>   <soapenv:Body>      <tem:ServerMessage>         <!--Optional:-->         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>30</CODE><SENDTIME>'+date+'</SENDTIME><GPS/><USRKEY>'+USRKEY+'</USRKEY><DEVKEY>999999</DEVKEY><VER>4</VER></HEADER><DATA><LOCK>1</LOCK><USR>'+USR+'</USR></DATA></MSG></DATA>]]></tem:xml>      </tem:ServerMessage>   </soapenv:Body></soapenv:Envelope>';
        console.log('XML SENDING TO LOGIN: ' + xml);
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
    function login() {
         var userId = "038243549";
        //$("#username").val();
        var password = "123456";
        //$("#password").val();
        var soapMessage = createLoginXML(userId, password);
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
                             data: soapMessage,
                             timeout: 30000 //30 seconds timeout
                         }).done(function (data) {
                             if (data != null) {
                                 var parser = new DOMParser();
                                 var xmlDoc = parser.parseFromString(data.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].firstChild.nodeValue, "text/xml");
                                 var firstChild = xmlDoc.childNodes[0];
                                 var secondChild = firstChild.childNodes[0];
                                 var thirdChild = secondChild.childNodes[1];
                                 var apprvCode = thirdChild.childNodes[0].textContent;
                                 var reason = thirdChild.childNodes[1].textContent;

                                 var params = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.children[1].children[1].firstChild.nodeValue, "text/xml");

                                 var MAX_EE_WT = params.firstChild.firstChild.children[1].children[5].innerHTML;
                                 var TASK_CLOSED2EXECUTION_TIME = params.firstChild.firstChild.children[1].children[6].innerHTML;
                                 var TASK_LAGGED_TIME = params.firstChild.firstChild.children[1].children[7].innerHTML;
                                 var TASK_NOTAPPROVED_TIME = params.firstChild.firstChild.children[1].children[8].innerHTML;
                                 var PHOTO_REQ = params.firstChild.firstChild.children[1].children[10].innerHTML;
                                 var NO_PH_SUG_MOZAR = params.firstChild.firstChild.children[1].children[11].innerHTML;
                                 var NO_PH_BC_ENDING = params.firstChild.firstChild.children[1].children[12].innerHTML;


                                 if (apprvCode == "5") {
                                     navigator.notification.alert(reason);

                                 }
                                 else if (apprvCode == "11") {
                                     navigator.notification.alert(reason);
                                 }
                                 else if (apprvCode == "12") {
                                     navigator.notification.alert(reason);
                                 }
                                 else if (apprvCode == "13") {
                                     navigator.notification.alert(reason);
                                 }
                                 else if (apprvCode == "38") {
                                     navigator.notification.alert(reason);
                                 }
                                 else if (apprvCode == "37") {
                                     navigator.notification.alert(reason);

                                 }
                                 else if (apprvCode == "1") {
                                     navigator.notification.alert(reason);
                                     location.href = "#/collect_joined";
                                 }
                                 else if (apprvCode == "3") {
                                     navigator.notification.alert(reason);
                                 }
                                 else {

                                     var USRKEY = thirdChild.childNodes[2].textContent;
                                     localStorage.setItem("USRKEY", USRKEY);
                                     var USR = thirdChild.childNodes[3].textContent;
                                     localStorage.setItem("USR", USR);
                                     var MOKED = thirdChild.childNodes[6].textContent;
                                     localStorage.setItem("MOKED", MOKED);
                                     var RLSCODE = thirdChild.childNodes[7].textContent;
                                     localStorage.setItem("RLSCODE", RLSCODE);

                                     localStorage.setItem("MAX_EE_WT", MAX_EE_WT);
                                     localStorage.setItem("TASK_CLOSED2EXECUTION_TIME", TASK_CLOSED2EXECUTION_TIME);
                                     localStorage.setItem("TASK_LAGGED_TIME", TASK_LAGGED_TIME);
                                     localStorage.setItem("TASK_NOTAPPROVED_TIME", TASK_NOTAPPROVED_TIME);
                                     localStorage.setItem("PHOTO_REQ", PHOTO_REQ);
                                     localStorage.setItem("NO_PH_SUG_MOZAR", NO_PH_SUG_MOZAR);
                                     localStorage.setItem("NO_PH_BC_ENDING", NO_PH_BC_ENDING);

                                     // var xmlBalanace = createBalanceXML(USRKEY, USR);
                                     //CheckBalance(xmlBalanace);
                                     location.href = "#/mesira_bdika";
                                 }
                             }
                             else {
                                 navigator.notification.alert('יש תקלה בשרת');
                             }

                         }).fail(function (jqXHR, textStatus, thrownError) {
                             navigator.notification.alert('Fail!');
                         });
    }
    function CheckBalance(xml) {
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
                                 var tt = 10;
                             }
                             else {
                                 navigator.notification.alert('יש תקלה בשרת');
                             }

                         }).fail(function (jqXHR, textStatus, thrownError) {
                             navigator.notification.alert('Fail!');
                         });
    }



    $(document).ready(function () {
        $(".loadDiv").hide();
    });
});

