export class VerifyError extends Error {
    public readonly code : number;
    public readonly errno : number | undefined;
    public readonly state: string | undefined;
    public readonly info?: any;
    constructor(message: string, code: number, errno?: number, state?: string, info?: any) {
        super(message);
        this.code = code;
        this.errno = errno;
        this.state = state;
        this.info = info;
        Object.setPrototypeOf(this, VerifyError.prototype);
    }
}
