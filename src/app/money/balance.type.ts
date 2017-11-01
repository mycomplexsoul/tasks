export class Balance {
    public bal_year: number;
    public bal_month: number;
    //public bal_currency: number;
    public bal_id_account: string;
    public bal_initial: number;
    public bal_charges: number;
    public bal_withdrawals: number;
    public bal_final: number;
    public bal_id_user: string;
    
    public bal_txt_account: string;

    constructor(base?: any) {
        if (base !== undefined){
            this.bal_year = base.bal_year;
            this.bal_month = base.bal_month;
            this.bal_id_account = base.bal_id_account;
            this.bal_initial = base.bal_initial;
            this.bal_charges = base.bal_charges;
            this.bal_withdrawals = base.bal_withdrawals;
            this.bal_final = base.bal_final;
            this.bal_id_user = base.bal_id_user;
            
            this.bal_txt_account = base.bal_txt_account;
        }
    }
}