import { Movement } from '../../crosscommon/entities/Movement';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { Utils } from '../../crosscommon/Utility';

@Injectable()
export class MovementService {
    private data: Array<Movement> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'movements'
        , defaultUser: 'anon'
        , api: {
            list: '/api/movements'
            , create: '/api/movements'
            , update: '/api/movements/:id'
            , batch: '/movement/batch' // not supported in NodeTS
        }
    }
    private apiRoot: string = '';
    private usage: string = 'ALWAYS_ON_LINE';
    // ALWAYS_ON_LINE = means no local storage layer, always fetch from server and always push to server, just save to storage when an error ocurrs
    // LOCAL_FIRST = means use local storage layer, fetch from server to local storage then push to server

    constructor(storage: StorageService, sync: SyncAPI){
        this.storage = storage;
        this.sync = sync;
        // get api root
        const options = storage.getObject('Options');
        this.apiRoot = options ? options['optServerAddress'] : '';
    }

    list(): Array<Movement> {
        return this.data;
    }

    initialData(){
        let list: Array<Movement>;

        let newData = (
            mov_id: string
            , mov_date: Date
            , mov_amount: number
            , mov_account: number
            , mov_account_to: number
            , mov_ctg_type: number
            , mov_budget: string
            , mov_id_category: number
            , mov_id_place: number
            , mov_desc: string
            , mov_notes: string
            , mov_id_user: string
            , mov_ctg_status: number
            , mov_txt_type: string
            , mov_txt_account: string
            , mov_txt_account_to: string
            , mov_txt_budget: string
            , mov_txt_category: string
            , mov_txt_place: string
            , mov_txt_status: string
        ) => {
            return {
                mov_id
                , mov_date
                , mov_amount
                , mov_account
                , mov_account_to
                , mov_ctg_type
                , mov_budget
                , mov_id_category
                , mov_id_place
                , mov_desc
                , mov_notes
                , mov_id_user
                , mov_ctg_status
                , mov_txt_type
                , mov_txt_account
                , mov_txt_account_to
                , mov_txt_budget
                , mov_txt_category
                , mov_txt_place
                , mov_txt_status
            };
        };
        let data: Array<Movement> = [];

        //data.push(newData('1','Walmart'));
        
        list = data.map((d: any) => {
            d.mov_id_user = this.config.defaultUser;
            return new Movement(d);
        });

        return list;
    }

    /**
     * Guidance for this method objective:
     * - Read sync data from storage
     * - Read from storage to memory
     * - If server is available
     *   - Push sync data to server, server decides changes to keep, returns sync results (merge if needed)
     *   - Fetch from server to memory, then save to local
     * - Return data
     * 
     * When new data comes (new, update, delete):
     * - Create sync data in memory and push it to local (to be available if push to server fails)
     * - Update local with changes
     * - If server is available
     *   - Push sync data to server, server decides changes to keep, returns sync results (straightforward in this case)
     */
    getAll(){
        /*let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }*/
        // sort data
        return this.sync.get(`${this.apiRoot}${this.config.api.list}`).then(data => {
            this.data = data.map((d: any): Movement => new Movement(d));
            this.data = this.data.sort(this.sort);
            return this.data;
        });
    }

    sort(a: Movement, b: Movement) {
        if ((new Date(a.mov_date)).getTime() < (new Date(b.mov_date)).getTime()) {
            return -1;
        } else if ((new Date(a.mov_date)).getTime() > (new Date(b.mov_date)).getTime()) {
            return 1;
        } else {
            return 0;
        }
    }

    getAllForUser(user: string){
        return this.getAll().then((list: Array<Movement>) => {
            return list.filter((x: Movement) => x.mov_id_user === user);
        });
    }

    saveToStorage(){
        //this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(date: Date){
        return Utils.hashId('mov', 32, date);
    }

    newItem(movement: Movement, callback: Function): Movement{
        const newId: string = this.newId(new Date(movement.mov_date));
        //const newId: string = Utils.hashId('mov', 32, new Date(movement.mov_date));
        movement.mov_id = newId;
        movement.mov_ctg_currency = 1;
        movement.mov_date_add = new Date();
        movement.mov_date_mod = new Date();
        const newItem = new Movement(movement);
        //this.data.push(newItem);
        //this.saveToStorage();
        this.sync.post(this.config.api.create, newItem).then(response => {
            if (response.operationOk) {
                callback();
            } else {
                newItem['sync'] = false;
            }
            this.data.push(newItem);
        }).catch(err => {
            // Append it to the listing but flag it as non-synced yet
            newItem['sync'] = false;
            this.data.push(newItem);
        });

        return newItem;
    }

    newBatch(movements: Array<Movement>){
        movements.forEach((m: Movement) => {
            m.mov_id = this.newId(m.mov_date);
            this.data.push(new Movement(m));
        });
        this.sendBatchToServer(movements);
        this.saveToStorage();
        return movements;
    }

    sendBatchToServer(list: Array<Movement>){
        this.sync.post(`${this.apiRoot}${this.config.api.batch}`, list).then((response: any) => {
            // response: { operationOk: true, details: {  } }
            console.log('response movements batch',response);
        });
    }

    edit(movement: Movement, callback: Function): Movement{
        movement.mov_ctg_currency = 1;
        movement.mov_date_mod = new Date();
        const item: Movement = new Movement(movement);

        this.sync.post(this.config.api.update.replace(':id', movement.mov_id), item).then(response => {
            const index = this.data.findIndex(d => d.mov_id === item.mov_id);
            if (response.operationOk) {
                callback();
            } else {
                item['sync'] = false;
            }
            this.data[index] = item;
        }).catch(err => {
            // Append it to the listing but flag it as non-synced yet
            const index = this.data.findIndex(d => d.mov_id === item.mov_id);
            item['sync'] = false;
            this.data[index] = item;
        });

        return item;
    }

}