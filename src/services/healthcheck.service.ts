import { ServiceSchema } from "moleculer";

const HealthCheckService : ServiceSchema = {
    name: "health",
    actions: {
        check(ctx: any) {
            ctx.meta.$responseRaw = true; 
            ctx.meta.$responseType = "application/json";    
            return {status: "OK"};
        },
    },
};
export = HealthCheckService;
