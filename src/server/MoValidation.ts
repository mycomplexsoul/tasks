import { iEntity } from "../crosscommon/iEntity";

export class MoValidation {
    model: iEntity = null;
    
    constructor(model: iEntity){
        this.model = model;
    }

    validateDataType = (): string => {
        let sql: string = '';

        return sql;
    }
}