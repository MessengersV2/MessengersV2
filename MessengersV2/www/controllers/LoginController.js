scotchApp.controller('loginController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.login = function () {
        login();
    };
    var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";

    function createLoginXML(userId, password) {

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">   <soapenv:Header/>   <soapenv:Body>      <tem:ServerMessage>         <!--Optional:-->         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>1</CODE><SENDTIME>03/11/2015 09:18:11</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER><DATA><USERID>'+ userId + '</USERID><PWD>'+password+'</PWD></DATA></MSG></DATA>]]></tem:xml>      </tem:ServerMessage>   </soapenv:Body></soapenv:Envelope>';
        console.log('XML SENDING TO LOGIN: ' + xml);
        return xml;
    }

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
                                     location.href = "#/resetPass";
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
                                     location.href = "#/collect";
                                 }
                             }
                             else {
                              

                                 navigator.notification.alert('יש תקלה בשרת');
                             }

                         }).fail(function (jqXHR, textStatus, thrownError) {
                             navigator.notification.alert('Fail!');
                         });

    }


});

