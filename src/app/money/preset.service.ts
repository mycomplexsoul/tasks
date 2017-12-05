import { Preset } from './preset.type';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PresetService {
    private data: Array<Preset> = [];
    private storage: StorageService = null;
    private config = {
        storageKey: 'presets'
        , defaultUser: 'anon'
    }

    constructor(storage: StorageService){
        this.storage = storage;
    }

    get list(): Array<Preset> {
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
        let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }
        return this.data;
    }

    getAllForUser(user: string){
        const all: Array<Preset> = this.getAll();

        return all.filter((x: Preset) => x.pre_id_user === user);
    }

    saveToStorage(){
        this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(){
        return this.data.length + 1 + '';
    }

    newItem(preset: Preset): Preset{
        let newId: string = this.newId();
        preset.pre_id = newId;
        let newItem = new Preset(preset);
        this.data.push(newItem);
        this.saveToStorage();
        return newItem;
    }
}