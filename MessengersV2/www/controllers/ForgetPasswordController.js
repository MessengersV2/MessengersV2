scotchApp.controller('forgetPassController', function ($scope) {
    $scope.onForgetPassword = function () {
        resetPass();
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
    console.log(xml);
    return xml;
}



function resetPass() {

    window.location.href = "#/collect";
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
    //                     window.location.href = "#/collect";
                        
    //                 }).fail(function (jqXHR, textStatus, thrownError) {
    //                     console.log('login failed: ' + thrownError);
    //                     var returnObject = {};
    //                     returnObject.errorCode = 2;
    //                     localStorage.setItem("errorCode", returnObject.errorCode);
    //                 });

}