// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        alert('In ready');
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
         

        $("#loginLinksRight").click(function () {
            $("#mainDiv").load('resetPass.html');
        })



        //$("#mainDiv").load('login.html');
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };


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



    function login()
    {
        var soapMessage = createLoginSoapMessage("", "");
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
                             console.log(data);
                             alert('Got Response!');
                         }).fail(function (jqXHR, textStatus, thrownError) {
                             console.log('login failed: ' + thrownError);
                             var returnObject = {};
                             returnObject.errorCode = 2;
                             localStorage.setItem("errorCode", returnObject.errorCode);
                         });

    }



    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();