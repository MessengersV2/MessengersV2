


//Generates an xml for this message.
function createChangePasswordSoapMessage(username, newPassword, oldPassword) {
    var xml = '<Header> \
                     <VER></VER>\
                     <MSGVER>1</MSGVER><CODE/>\
                     <SENDTIME/>\
                     <DEVKEY/>\
                     <USRKEY/>\
                     <GPS/>\
                 <Header/>\
                \
                <DATA> \
                     <USERID>' + username + '</USERID>\
                     <PWD>' + newPassword + '</PWD>\
                     <OLPWD>' + oldPassword + '</OLPWD>\
                 </DATA>';
    console.log(xml);
    return xml;
}

// On login click method
function resetPass() {

    var oldPass = document.getElementById("oldpass").value;
    var newPass = document.getElementById("newpass").value;

    var xml = createChangePasswordSoapMessage(username, password,oldPassword);

    var soapMessage = createLoginSoapMessage(username, password);
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
                             "SOAPAction": "http://tempuri.org/IService1/authenticate"
                         },
                         crossDomain: true,
                         data: soapMessage,
                         timeout: 30000 //30 seconds timeout
                     }).done(function (data) {
                         if (data != null) {
                             var json = xmlToJson(data);
                             var jsonObject = JSON.parse(json);
                             var approveCode = jsonObject["APPRV"];
                             if (approveCode == 0) {
                                 // Go To  Main Page
                             }
                             else if (approveCode == 1) {

                                 //Go To Change Password
                             }
                             else {
                                 navigator.notification.alert(jsonObject["REASON"]);
                             }

                         }

                     }).fail(function (jqXHR, textStatus, thrownError) {
                         console.log('login failed: ' + thrownError);
                         var returnObject = {};
                         returnObject.errorCode = 2;
                         localStorage.setItem("errorCode", returnObject.errorCode);
                     });

}

// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};






