function requestAccessorInfo() {
    let msg = { type: "accessorinfo" };
    sendMessageToParent(msg);
}
function sendMessageToParent(data) {
    if(!data) return;
    try {
        console.log("sendMessageToParent:",data);
        window.parent.postMessage(JSON.stringify(data), "*");
    } catch(ex) { console.log(ex); }
}
function handleRequestMessage(data) {
    if(data && data.type=="storage") {
        if(data.API_URL) API_URL = data.API_URL;
        if(data.BASE_URL) BASE_URL = data.BASE_URL;
        if(data.API_TOKEN) API_TOKEN = data.API_TOKEN;
        if(data.accessorinfo) {
            saveAccessorInfo(data.accessorinfo);
        }
        console.log("saveAccessorInfo",data.accessorinfo);
    }
}
window.onmessage = function(e) {
    console.log("interface: onmessage:",e.data);
    try {
        let payload = JSON.parse(e.data);
        handleRequestMessage(payload);
    } catch(ex) { console.log(ex); }
}
