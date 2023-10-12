import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Utilities } from "@willsofts/will-util";
import { HTTP } from "@willsofts/will-api";
import { DB_SECTION } from "../utils/EnvironmentVariable";
import { KnCategory } from "../utils/KnCategory";
import { TknDataTableHandler } from '../handlers/TknDataTableHandler';
import { VerifyError } from '../models/VerifyError';
import { TheCategories } from "../utils/TheCategories";

const CategoryService : ServiceSchema = {
    name: "category",
    mixins: [KnService],
    model: {
        name: "tcategory",
        alias: { privateAlias: DB_SECTION },
    },
    settings: {
        disableColumnSchema: true, //do not return column schema
        disableQueryPaging: true, //do not paging
    },
    actions: {
        async groups(context: any) {
            let names = context.params.names;
            if(Utilities.isString(names)) {
                names = names.split(",");
            }
            console.log("names",names);
            if(!names || names.length==0) {
                return Promise.reject(new VerifyError("Parameter not found (names)",HTTP.NOT_ACCEPTABLE,-16061));
            }
            let handler = new TknDataTableHandler();
            let userToken = await handler.getUserTokenInfo(context, true);
            let settings = KnCategory.getSetting(context, TheCategories.getSetting, userToken, ...names);
            let db = handler.getConnector(DB_SECTION);
            try {
                return await handler.getDataCategory(db, settings, true, context); 
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                return Promise.reject(handler.getDBError(ex));
            } finally {
                if(db) db.close();
            }
        },
        async lists(context: any) {
            let names = context.params.names;
            if(Utilities.isString(names)) {
                names = names.split(",");
            }
            if(!names || names.length==0) {
                return Promise.reject(new VerifyError("Parameter not found (names)",HTTP.NOT_ACCEPTABLE,-16061));
            }
            let handler = new TknDataTableHandler();
            let userToken = await handler.getUserTokenInfo(context, true);
            let settings = KnCategory.getSetting(context, TheCategories.getSetting, userToken, ...names);
            let db = handler.getConnector(DB_SECTION);
            try {
                return await handler.getDataTable(db, settings, true, context); 
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                return Promise.reject(handler.getDBError(ex));
            } finally {
                if(db) db.close();
            }
        },
    }    
}
export = CategoryService;
