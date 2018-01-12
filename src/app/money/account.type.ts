export class Account {
    public acc_id: string;
    public acc_name: string;
    public acc_ctg_type: number;
    public acc_comment: string;
    public acc_check_day: number;
    public acc_average_min_balance: number;
    public acc_payment_day: number;
    public acc_id_user: number;

    public acc_txt_type: string;

    constructor(base?: any) {
        if (base !== undefined){
            this.acc_id = base.acc_id;
            this.acc_name = base.acc_name;
            this.acc_ctg_type = base.acc_ctg_type;
            this.acc_comment = base.acc_comment;
            this.acc_check_day = base.acc_check_day;
            this.acc_average_min_balance = base.acc_average_min_balance;
            this.acc_payment_day = base.acc_payment_day;
            this.acc_id_user = base.acc_id_user;
            
            this.acc_txt_type = base.acc_txt_type;
        }
    }
}