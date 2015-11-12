scotchApp.controller('forgetPassController', function ($scope) {
    $scope.onForgetPassword = function () {
        resetPass();
    };
});

var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";
function displayErrorMessage(errorMessageToDisplay) {
    navigator.notification.alert(errorMessageToDisplay);
}
function validateManaualCode(manualcode) {


    //must have exactly 13 chars
    //first 2 chars must be alphanumeric
    //next 9 chars must be numeric
    //last 2 chars must be letters
    var errorManualCode1 = 'מספר התווים בברקוד חייב להיות בדיוק 13';
    var errorManualCode2 = '2 התווים הראשונים חייבים להיות אלפא-נומריים';
    var errorManualCode3 = '9 התווים האמצעיים חייבים להיות נומריים';
    var errorManualCode4 = '2 התווים האחרונים חייבים להיות אלפא-נומריים';
    var errorMessageToDisplay = '';
    var barcodeExpectedLength = 13;
    var validated = true;
    if (manualcode.length != barcodeExpectedLength)
    { errorMessageToDisplay = errorManualCode1; validated = false; }
    if (validated == true && (/[^a-zA-Z0-9]/.test(manualcode.substring(0, 2))))
    { errorMessageToDisplay = errorManualCode2; validated = false; }
    if (validated == true && isNaN(manualcode.substring(2, 11)))
    { errorMessageToDisplay = errorManualCode3; validated = false; }
    if (validated == true && (/[^a-zA-Z0-9]/.test(manualcode.substring(11, 13))))
    { errorMessageToDisplay = errorManualCode4; validated = false; }
    if (validated == false) {
        console.log('manual barcode error: ' + errorMessageToDisplay);
        displayErrorMessage(errorMessageToDisplay);
    }
    return validated;
}

function createLoginSoapMessage(userid,oldpass,newpass) {
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:ServerMessage><!--Optional:--><tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>16</CODE><SENDTIME>03/11/2015 09:18:11</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER><DATA><USERID>'+userid+'</USERID><PWD>'+newpass+'</PWD><OLPWD>'+oldpass+'</OLPWD></DATA></MSG></DATA>]]></tem:xml></tem:ServerMessage></soapenv:Body></soapenv:Envelope>';
    console.log(xml);
    return xml;
}
function resetPass() {

    var oldpass = "123456";
        //$(".oldpass").val();
    var userid = "038243549";
        //$(".userinput").val();
    var newpass = "boaz1234"
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

                             if (apprv == "1") {
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

 