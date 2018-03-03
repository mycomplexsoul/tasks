export class Preset {
    public pre_id: string;
    public pre_name: string;
    public pre_date: Date;
    public pre_ctg_currency: number;
    public pre_amount: number;
    public pre_id_account: string;
    public pre_id_account_to: string;
    public pre_ctg_type: number;
    public pre_budget: string;
    public pre_id_category: number;
    public pre_id_place: number;
    public pre_desc: string;
    public pre_notes: string;
    public pre_id_user: string;
    public pre_ctg_status: number;

    public pre_txt_currency: string;
    public pre_txt_type: string;
    public pre_txt_account: string;
    public pre_txt_account_to: string;
    public pre_txt_budget: string;
    public pre_txt_category: string;
    public pre_txt_place: string;
    public pre_txt_status: string;

    constructor(base?: any) {
        if (base !== undefined){
            this.pre_id = base.pre_id;
            this.pre_name = base.pre_name;
            this.pre_date = base.pre_date;
            this.pre_ctg_currency = base.pre_ctg_currency;
            this.pre_amount = base.pre_amount;
            this.pre_id_account = base.pre_id_account;
            this.pre_id_account_to = base.pre_id_account_to;
            this.pre_ctg_type = base.pre_ctg_type;
            this.pre_budget = base.pre_budget;
            this.pre_id_category = base.pre_id_category;
            this.pre_id_place = base.pre_id_place;
            this.pre_desc = base.pre_desc;
            this.pre_notes = base.pre_notes;
            this.pre_id_user = base.pre_id_user;
            this.pre_ctg_status = base.pre_ctg_status;
            
            this.pre_txt_currency = base.pre_txt_currency;
            this.pre_txt_type = base.pre_txt_type;
            this.pre_txt_account = base.pre_txt_account;
            this.pre_txt_account_to = base.pre_txt_account_to;
            this.pre_txt_budget = base.pre_txt_budget;
            this.pre_txt_category = base.pre_txt_category;
            this.pre_txt_place = base.pre_txt_place;
            this.pre_txt_status = base.pre_txt_status;
        }
    }
}