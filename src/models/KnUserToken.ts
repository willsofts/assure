export class KnUserToken {
    public useruuid : string = "";
    public expiretimes : number = 0;
    public code: string = "";
    public state: string = "";
    public nonce: string = "";
    public authtoken: string = "";
    constructor (useruuid: string, expiretimes: number, code: string, state: string, nonce: string, authtoken: string) {
        this.useruuid = useruuid;
        this.expiretimes = expiretimes;
        this.code = code;
        this.state = state;
        this.nonce = nonce;
        this.authtoken = authtoken;
    }
}
