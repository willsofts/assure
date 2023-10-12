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
broker.start();
/*
this broker can be run with NATS in order to plugin services on separated node
*/
