import { Request, Response } from 'express';
import { TknLaunchRouter } from './TknLaunchRouter';

export class TknControlRouter extends TknLaunchRouter {
    public override async isValidateLauncher(req: Request, res: Response, ctx: any) : Promise<boolean> {
        return true;
    }
}
