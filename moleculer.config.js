var os = require("os");

module.exports = {
    nodeID: "express-"+os.hostname().toLowerCase() + "-" + process.pid,
    logger: [
        {
            type: "Console",
            options: {
                level: "debug",
                color: true,
                formatter: "full",
            } 
        },                   
        {
            type: "File",
            options: {
                level: "debug",
                formatter: "full",
                folder: "./logs",
                filename: "express-{date}.log",
                eol: "\n",
                interval: 1000,
            }
        }
    ],
    registry: {
        strategy: "RoundRobin"
    },
    /*    
    transporter: "NATS",
    transporter: "nats://localhost:4222",
    requestTimeout: 5 * 1000,

    circuitBreaker: {
        enabled: true
    },

    metrics: false,
    statistics: true
    */
   
    tracing: {
        enabled: true,
        exporter: {
            type: "Jaeger",
            options: {
                endpoint: null, //"http://localhost:14250", //not work               
                host: "localhost",
                port: 6832,
                tracerOptions: {},
                defaultTags: [{"module.name":"mext"}]
            }
        }
    },   
    /*
	metrics: {
        enabled: true,
        reporter: [
            {
                type: "Prometheus",
                options: {
                    // HTTP port
                    port: 3030,
                    // HTTP URL path
                    path: "/metrics",
                    // Default labels which are appended to all metrics labels
                    defaultLabels: registry => ({
                        namespace: registry.broker.namespace,
                        nodeID: registry.broker.nodeID
                    })
                }
            }
        ]
    }*/	
};
