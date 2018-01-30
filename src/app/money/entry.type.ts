export class Entry {
    public ent_id: string;
    public ent_sequential: number;
    public ent_date: Date;
    public ent_amount: number;
    public ent_id_account: string;
    public ent_ctg_type: number;
    public ent_budget: string;
    public ent_id_category: number;
    public ent_id_place: number;
    public ent_desc: string;
    public ent_notes: string;
    public ent_id_user: string;
    public ent_ctg_status: number;

    public ent_txt_type: string;
    public ent_txt_account: string;
    public ent_txt_budget: string;
    public ent_txt_category: string;
    public ent_txt_place: string;
    public ent_txt_status: string;

    constructor(base?: any) {
        if (base !== undefined){
            this.ent_id = base.ent_id;
            this.ent_sequential = base.ent_sequential;
            this.ent_date = base.ent_date;
            this.ent_amount = base.ent_amount;
            this.ent_id_account = base.ent_id_account;
            this.ent_ctg_type = base.ent_ctg_type;
            this.ent_budget = base.ent_budget;
            this.ent_id_category = base.ent_id_category;
            this.ent_id_place = base.ent_id_place;
            this.ent_desc = base.ent_desc;
            this.ent_notes = base.ent_notes;
            this.ent_id_user = base.ent_id_user;
            this.ent_ctg_status = base.ent_ctg_status;

            this.ent_txt_type = base.ent_txt_type;
            this.ent_txt_account = base.ent_txt_account;
            this.ent_txt_budget = base.ent_txt_budget;
            this.ent_txt_category = base.ent_txt_category;
            this.ent_txt_place = base.ent_txt_place;
            this.ent_txt_status = base.ent_txt_status;
        }
    }
}