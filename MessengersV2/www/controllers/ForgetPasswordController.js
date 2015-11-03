scotchApp.controller('forgetPassController', function ($scope) {
    $scope.onForgetPassword = function () {
        resetPass();
    };
});

var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";

function createLoginSoapMessage(userid,oldpass,newpass) {
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:ServerMessage><!--Optional:--><tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>16</CODE><SENDTIME>03/11/2015 09:18:11</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER><DATA><USERID>'+userid+'</USERID><PWD>'+newpass+'</PWD><OLPWD>'+oldpass+'</OLPWD></DATA></MSG></DATA>]]></tem:xml></tem:ServerMessage></soapenv:Body></soapenv:Envelope>';
    console.log(xml);
    return xml;
}
function resetPass() {

    var oldpass = "one1one";
        //$(".oldpass").val();
    var userid = "038243549";
        //$(".userinput").val();
    var newpass = "1234bbb"
        //$(".passinput").val();

    var soapMessage = createLoginSoapMessage(userid, oldpass, newpass)
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
                             var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.textContent, "text/xml");
                             var apprv = xmlDoc.firstChild.firstChild.childNodes[1].childNodes[0].innerHTML;
                             var reason = xmlDoc.firstChild.firstChild.childNodes[1].childNodes[1].innerHTML;

                             if (apprvCode == "1") {
                                 navigator.notification.alert(reason);
                             }
                             else {
                                 navigator.notification.alert('Good!');
                             }
                         }
                         else {
                             navigator.notification.alert('יש תקלה בשרת');
                         }

                     }).fail(function (jqXHR, textStatus, thrownError) {
                         navigator.notification.alert('Fail!');
                     });

}

 