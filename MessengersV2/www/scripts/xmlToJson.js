// changes xml to json

function xmltojson(xml) { 

    // create the return object
    var obj = {};

    if (xml.nodetype == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodename] = attribute.nodevalue;
            }
        }
    } else if (xml.nodetype == 3) { // text
        obj = xml.nodevalue;
    }

    // do children
    if (xml.haschildnodes()) {
        for (var i = 0; i < xml.childnodes.length; i++) {
            var item = xml.childnodes.item(i);
            var nodename = item.nodename;
            if (typeof (obj[nodename]) == "undefined") {
                obj[nodename] = xmltojson(item);
            } else {
                if (typeof (obj[nodename].push) == "undefined") {
                    var old = obj[nodename];
                    obj[nodename] = [];
                    obj[nodename].push(old);
                }
                obj[nodename].push(xmltojson(item));
            }
        }
    }
    return obj;
};

