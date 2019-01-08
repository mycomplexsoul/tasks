import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Balance } from "../../crosscommon/entities/Balance";
import { BalanceModule } from "../BalanceModule";

export class BalanceServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Balance());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    rebuild = async (req: any, res: any) => {
        const balanceModule: BalanceModule = new BalanceModule();
        const {
            year,
            month,
            user
        } = req.params; // TODO: validate params types and values
        let message: string = 'Something went wrong, please try again later';

        const result = await balanceModule.rebuild(year, month, user);
        if (result) {
            message = 'Rebuild process finished correctly.';
        }
        res.end(JSON.stringify({ operationResult: result, message }));
    }

    transfer = async (req: any, res: any) => {
        const balanceModule: BalanceModule = new BalanceModule();
        const {
            year,
            month,
            user
        } = req.params; // TODO: validate params types and values
        let message: string = 'Something went wrong, please try again later';

        const result = await balanceModule.transfer(year, month, user);
        if (result) {
            message = 'Rebuild process finished correctly.';
        }
        res.end(JSON.stringify({ operationResult: result, message }));
    }

    rebuildAndTransfer = async (req: any, res: any) => {
        const balanceModule: BalanceModule = new BalanceModule();
        const {
            year,
            month,
            user
        } = req.params; // TODO: validate params types and values
        const message: string = 'Rebuild process finished correctly.';

        balanceModule.rebuildAndTransfer(year, month, user);
        res.end(JSON.stringify({ operationResult: true, message }));
    }

    rebuildAndTransferRange = async (req: any, res: any) => {
        const balanceModule: BalanceModule = new BalanceModule();
        const {
            year,
            month,
            user
        } = req.query; // TODO: validate params types and values
        const message: string = 'Rebuild process finished correctly.';
        const currentDate: Date = new Date();

        balanceModule.rebuildAndTransferRange(Number.parseInt(year), Number.parseInt(month), currentDate.getFullYear(), currentDate.getMonth() + 1, user);
        res.end(JSON.stringify({ operationResult: true, message }));
    }
}
