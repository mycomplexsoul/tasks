import { Entry } from '../../crosscommon/entities/Entry';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';

@Injectable()
export class EntryService {
    private data: Array<Entry> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'entries'
        , defaultUser: 'anon'
    }
    private apiRoot: string = '';

    constructor(storage: StorageService, sync: SyncAPI){
        this.storage = storage;
        this.sync = sync;
        const options = storage.getObject('Options');
        this.apiRoot = options ? options['optServerAddress'] : '';
    }

    list(): Array<Entry> {
        return this.data;
    }

    initialData(){
        let list: Array<Entry> = [];

        // let newData = (
        //     mov_id: string
        //     , mov_date: Date
        //     , mov_amount: number
        //     , mov_account: number
        //     , mov_account_to: number
        //     , mov_ctg_type: number
        //     , mov_budget: string
        //     , mov_ctg_category: number
        //     , mov_ctg_place: number
        //     , mov_desc: string
        //     , mov_notes: string
        //     , mov_id_user: string
        //     , mov_ctg_status: number
        //     , mov_txt_type: string
        //     , mov_txt_account: string
        //     , mov_txt_account_to: string
        //     , mov_txt_budget: string
        //     , mov_txt_category: string
        //     , mov_txt_place: string
        //     , mov_txt_status: string
        // ) => {
        //     return {
        //         mov_id
        //         , mov_date
        //         , mov_amount
        //         , mov_account
        //         , mov_account_to
        //         , mov_ctg_type
        //         , mov_budget
        //         , mov_ctg_category
        //         , mov_ctg_place
        //         , mov_desc
        //         , mov_notes
        //         , mov_id_user
        //         , mov_ctg_status
        //         , mov_txt_type
        //         , mov_txt_account
        //         , mov_txt_account_to
        //         , mov_txt_budget
        //         , mov_txt_category
        //         , mov_txt_place
        //         , mov_txt_status
        //     };
        // };
        // let data: Array<Entry> = [];

        // //data.push(newData('1','Walmart'));
        
        // list = data.map((d: any) => {
        //     d.mov_id_user = this.config.defaultUser;
        //     return new Entry(d);
        // });

        return list;
    }

    getAll(): Promise<Array<Entry>>{
        const sort = ((a: Entry, b: Entry) => {
            if (a.ent_date < b.ent_date) {
                return -1;
            } else if (a.ent_date > b.ent_date) {
                return 1;
            } else {
                return 0;
            }
        });
        return this.sync.get(`${this.apiRoot}/api/entries`).then(data => {
            this.data = data.map((d: any): Entry => new Entry(d));
            this.data = this.data.sort(sort);
            return this.data;
        });
    }

    getAllForUser(user: string){
        return this.getAll().then((list: Array<Entry>) => {
            return list.filter((x: Entry) => x.ent_id_user === user);
        });
    }

    saveToStorage(){
        // this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(){
        return this.data.length + 1 + '';
    }

    newItem(item: Entry): Entry{
        //let newId: string = this.newId();
        //item.ent_id = newId;
        let newItem = new Entry(item);
        this.data.push(newItem);
        this.saveToStorage();
        return newItem;
    }
}