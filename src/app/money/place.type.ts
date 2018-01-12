export class Place {
    public mpl_id: string;
    public mpl_name: string;
    public mpl_id_user: string;
    
    constructor(base?: any) {
        if (base !== undefined){
            this.mpl_id = base.mpl_id;
            this.mpl_name = base.mpl_name;
            this.mpl_id_user = base.mpl_id_user;
        }
    }
}