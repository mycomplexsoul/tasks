export class Movement {
    public mov_id: string;
    public mov_date: Date;
    public mov_ctg_currency: number;
    public mov_amount: number;
    public mov_id_account: string;
    public mov_id_account_to: string;
    public mov_ctg_type: number;
    public mov_budget: string;
    public mov_id_category: number;
    public mov_id_place: number;
    public mov_desc: string;
    public mov_notes: string;
    public mov_id_user: string;
    public mov_ctg_status: number;
    public mov_date_add: Date;
    public mov_date_mod: Date;

    public mov_txt_type: string;
    public mov_txt_account: string;
    public mov_txt_account_to: string;
    public mov_txt_budget: string;
    public mov_txt_category: string;
    public mov_txt_place: string;
    public mov_txt_status: string;

    constructor(base?: any) {
        if (base !== undefined){
            this.mov_id = base.mov_id;
            this.mov_date = base.mov_date;
            this.mov_amount = base.mov_amount;
            this.mov_id_account = base.mov_id_account;
            this.mov_id_account_to = base.mov_id_account_to;
            this.mov_ctg_type = base.mov_ctg_type;
            this.mov_budget = base.mov_budget;
            this.mov_id_category = base.mov_id_category;
            this.mov_id_place = base.mov_id_place;
            this.mov_desc = base.mov_desc;
            this.mov_notes = base.mov_notes;
            this.mov_id_user = base.mov_id_user;
            this.mov_ctg_status = base.mov_ctg_status;

            this.mov_txt_type = base.mov_txt_type;
            this.mov_txt_account = base.mov_txt_account;
            this.mov_txt_account_to = base.mov_txt_account_to;
            this.mov_txt_budget = base.mov_txt_budget;
            this.mov_txt_category = base.mov_txt_category;
            this.mov_txt_place = base.mov_txt_place;
            this.mov_txt_status = base.mov_txt_status;
        }
    }
}