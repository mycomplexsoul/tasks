import { Movement } from './movement.type';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { UtilsCommon } from '../common/utils.common';

@Injectable()
export class MovementService {
    private data: Array<Movement> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private utils: UtilsCommon = null;
    private config = {
        storageKey: 'movements'
        , defaultUser: 'anon'
    }
    private apiRoot: string = '';

    constructor(storage: StorageService, sync: SyncAPI, utils: UtilsCommon){
        this.storage = storage;
        this.sync = sync;
        this.utils = utils;
        // get api root
        this.apiRoot = storage.getObject('Options')['optServerAddress'];
    }

    get list(): Array<Movement> {
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

    getAll(){
        let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }
        // sort data
        let sort = (a: Movement, b: Movement) => {
            if (a.mov_date < b.mov_date) {
                return -1;
            } else if (a.mov_date > b.mov_date) {
                return 1;
            } else {
                return 0;
            }
        };
        this.data = this.data.sort(sort);
        return this.data;
    }

    getAllForUser(user: string){
        const all: Array<Movement> = this.getAll();

        return all.filter((x: Movement) => x.mov_id_user === user);
    }

    saveToStorage(){
        this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(date: Date){
        return this.utils.hashId('M',32,date);
    }

    newItem(movement: Movement): Movement{
        let newId: string = this.newId(movement.mov_date);
        movement.mov_id = newId;
        let newItem = new Movement(movement);
        this.data.push(newItem);
        this.saveToStorage();
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
        this.sync.post(`${this.apiRoot}/movement/batch`, list).then((response: any) => {
            // response: { processOk: true, details: {  } }
            console.log('response movements batch',response);
        });
    }
}