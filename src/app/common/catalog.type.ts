export class Catalog {
    public ctg_id: string;
    public ctg_sequential: number;
    public ctg_name: string;

    constructor(base: any) {
        if (base !== undefined){
            this.ctg_id = base.ctg_id;
            this.ctg_sequential = base.ctg_sequential;
            this.ctg_name = base.ctg_name;
        }
    }
}