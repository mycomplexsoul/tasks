import { Preset } from '../../crosscommon/entities/Preset';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { Utils } from '../../crosscommon/Utility';

@Injectable()
export class PresetService {
    private data: Array<Preset> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'presets'
        , defaultUser: 'anon'
        , api: {
            list: '/api/presets'
            , create: '/api/presets'
            , update: '/api/presets/:id'
        }
    };
    private apiRoot: string = '';

    constructor(storage: StorageService, sync: SyncAPI){
        this.storage = storage;
        this.sync = sync;
        // get api root
        const options = storage.getObject('Options');
        this.apiRoot = options ? options['optServerAddress'] : '';
    }

    list(): Array<Preset> {
        return this.data;
    }

    initialData(){
        let list: Array<Preset>;

        let newData = (
            pre_id: string
            , pre_name: string
            , pre_date: Date
            , pre_amount: number
            , pre_account: number
            , pre_account_to: number
            , pre_ctg_type: number
            , pre_budget: string
            , pre_ctg_category: number
            , pre_ctg_place: number
            , pre_desc: string
            , pre_notes: string
            , pre_id_user: string
            , pre_ctg_status: number
            , pre_txt_type: string
            , pre_txt_account: string
            , pre_txt_account_to: string
            , pre_txt_budget: string
            , pre_txt_category: string
            , pre_txt_place: string
            , pre_txt_status: string
        ) => {
            return {
                pre_id
                , pre_name
                , pre_date
                , pre_amount
                , pre_account
                , pre_account_to
                , pre_ctg_type
                , pre_budget
                , pre_ctg_category
                , pre_ctg_place
                , pre_desc
                , pre_notes
                , pre_id_user
                , pre_ctg_status
                , pre_txt_type
                , pre_txt_account
                , pre_txt_account_to
                , pre_txt_budget
                , pre_txt_category
                , pre_txt_place
                , pre_txt_status
            };
        };
        let data: Array<Preset> = [];

        //data.push(newData('1','Walmart'));
        
        list = data.map((d: any) => {
            d.pre_id_user = this.config.defaultUser;
            return new Preset(d);
        });

        return list;
    }

    getAll(){
        return this.sync.get(`${this.apiRoot}${this.config.api.list}`).then(data => {
            this.data = data.map((d: any): Preset => new Preset(d));
            this.data = this.data.sort(this.sort);
            return this.data;
        });
    }

    sort(a: Preset, b: Preset) {
        if (a.pre_name > b.pre_name) {
            return -1;
        } else if (a.pre_name < b.pre_name) {
            return 1;
        } else {
            return 0;
        }
    }

    getAllForUser(user: string){
        return this.getAll().then((list: Array<Preset>) => {
            return list.filter((x: Preset) => x.pre_id_user === user);
        });
    }

    saveToStorage(){
        //this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(){
        return  Utils.hashId('pre', 32);
    }

    newItem(preset: Preset): Preset{
        const newId: string = this.newId();
        preset.pre_id = newId;
        preset.pre_ctg_currency = 1;
        preset.pre_date_add = new Date();
        preset.pre_date_mod = new Date();
        const newItem = new Preset(preset);
        //this.data.push(newItem);
        //this.saveToStorage();
        this.sync.post(this.config.api.create, newItem).then(response => {
            if (response.processOk) {
                this.data.push(newItem);
            } else {
                newItem['sync'] = false;
                this.data.push(newItem);
            }
        }).catch(err => {
            // Append it to the listing but flag it as non-synced yet
            newItem['sync'] = false;
            this.data.push(newItem);
        });

        return newItem;
    }
}