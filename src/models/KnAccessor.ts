export class KnAccessor {
    public readonly useruuid: string;
    public readonly userid: string;
    public readonly authtoken: string;
    public readonly userinfo?: any
    constructor(useruuid: string, userid: string, authtoken: string, userinfo?: any) {
        this.useruuid = useruuid;
        this.userid = userid;
        this.authtoken = authtoken;
        this.userinfo = userinfo;
    }
}
