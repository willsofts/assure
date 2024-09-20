import { ServiceBroker } from "moleculer";
let args = process.argv.slice(2);
console.log("broker: args",args);
const configure = require("../moleculer.config.js");
const broker = new ServiceBroker(configure);
if(args && args.length>0) {
    for(let i=0;i<args.length;i++) {
        broker.loadServices(args[i]);
    }
}
broker.start()
.then(() => broker.call("$node.services").then((services: any) => {
    let servicenames = [];
    for(let s of services) {
        if(s.name!="$node" && s.name!="api") {
            servicenames.push(s.name);
        }
    }
    console.log("service names",servicenames);
    console.log("number of services",servicenames.length);
}))
/*
this broker can be run with NATS in order to plugin services on separated node
*/
