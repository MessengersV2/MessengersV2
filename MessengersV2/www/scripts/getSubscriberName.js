function getSubscriberName(subscriberId) {
    /*check if the subscriber table is already loaded into the global area. 
      if yes, return from local, else invoke remote method, insert the data to local,
      and then return the value */
    if (localStorage.getItem('contactsTable') === null || localStorage.getItem('contactsTable') == 'undefined') {
        getContactsAjax();
    }                
    var str = getName(subscriberId);    
    return str;
}

function getContactsAjax() {
    var date = getCurrentDate();
    var xml =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:ServerMessage>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>13</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
							    <DATA>\
                                    <TBL>\
                                        <TBLID>3</TBLID>\
                                        <TBLDATA>1</TBLDATA>\
                                        <TBLSTR>1</TBLSTR>\
                                    </TBL>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:ServerMessage>\
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
                            "SOAPAction": "http://tempuri.org/IService1/ServerMessage"
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
                            var contactsTable = JSONData.DATA.MSG.DATA.NewDataSet;
                            localStorage.setItem('contactsTable', JSON.stringify(contactsTable));
                        }//end if (data != null)                                                   
                    }).fail(function (jqXHR, textStatus, thrownError) {
                        //navigator.notification.alert('Fail!');
                        console.log('Message #13 Fail!');
                    });

}

function getName(subscriberId) {
    console.log('getName, subscriberId= ' + subscriberId);
    var subscriberName = '';
    var contactsTable = JSON.parse(localStorage.getItem('contactsTable'));
    for (var i = 0; i < contactsTable.Table.length; i++) {
        if (contactsTable.Table[i].MemberNumber == subscriberId) {
            subscriberName = contactsTable.Table[i].MemberDesc.trim();
            console.log('found subscriberName! ' + subscriberName);
            break;
        } 
    }
    return subscriberName;
}


