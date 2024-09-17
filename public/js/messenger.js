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
        if(data.API_URL !== undefined) API_URL = data.API_URL;
        if(data.BASE_URL !== undefined) BASE_URL = data.BASE_URL;
        if(data.CHAT_URL !== undefined) CHAT_URL = data.CHAT_URL;
        if(data.CDN_URL !== undefined) CDN_URL = data.CDN_URL;
        if(data.IMG_URL !== undefined) IMG_URL = data.IMG_URL;
        if(data.BASE_CSS !== undefined) BASE_CSS = data.BASE_CSS;
        if(data.API_TOKEN !== undefined) API_TOKEN = data.API_TOKEN;
        if(data.BASE_STORAGE !== undefined) BASE_STORAGE = data.BASE_STORAGE;
        if(data.SECURE_STORAGE !== undefined) SECURE_STORAGE = data.SECURE_STORAGE;
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
