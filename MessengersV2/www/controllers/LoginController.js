scotchApp.controller('loginController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.login = function () {
        login();
    };
});

var serverUrl = "https://193.46.64.172:9464/WcfShlihimPhoneDocs";

function createLoginSoapMessage(username, password) {

    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:ServerMessage>\
         <!--Optional:-->\
         <tem:xml>?</tem:xml>\
      </tem:ServerMessage>\
   </soapenv:Body>\
</soapenv:Envelope>';



    //var xml = "<HEADER><MSGVER>1</MSGVER><CODE/><SENDTIME></HEADER><DATA><USERID>23</USERID><PWD>TEST</PWD></DATA>";
    console.log('XML SENDING TO LOGIN: ' + xml);
    return xml;
}



function login() {

    window.location.href = "#/collect";
    //var soapMessage = createLoginSoapMessage("", "");
    //$
    //   .ajax(
    //                 {
    //                     url: serverUrl,
    //                     dataType: "xml",
    //                     //dataType: 'json',
    //                     type: "POST",
    //                     async: false,
    //                     contentType: "text/xml;charset=utf-8",
    //                     headers: {
    //                         "SOAPAction": "http://tempuri.org/IService1/ServerMessage"
    //                     },
    //                     crossDomain: true,
    //                     data: soapMessage,
    //                     timeout: 30000 //30 seconds timeout
    //                 }).done(function (data) {
    //                     //location.path = '#/deliver';
    //                     window.location.href = "#/deliver";
    //                 }).fail(function (jqXHR, textStatus, thrownError) {
    //                     console.log('login failed: ' + thrownError);
    //                     var returnObject = {};
    //                     returnObject.errorCode = 2;
    //                     localStorage.setItem("errorCode", returnObject.errorCode);
    //                 });

}