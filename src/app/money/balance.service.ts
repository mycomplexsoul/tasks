import { Balance } from '../../crosscommon/entities/Balance';
import { Entry } from '../../crosscommon/entities/Entry';
import { EntryService } from './entry.service';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { DateUtils } from '../../crosscommon/DateUtility';

@Injectable()
export class BalanceService {
    private data: Array<Balance> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private entryService: EntryService = null;
    private config = {
        storageKey: 'balance'
        , defaultUser: 'anon'
        , api: {
            list: '/api/balance'
        }
    }
    private apiRoot: string = '';

    constructor(storage: StorageService, entryService: EntryService, sync: SyncAPI){
        this.storage = storage;
        this.entryService = entryService;
        this.sync = sync;
        // get api root
        const options = storage.getObject('Options');
        this.apiRoot = options ? options['optServerAddress'] : '';
    }

    list(): Array<Balance> {
        return this.data;
    }

    initialData(){
        let list: Array<Balance> = [];

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

    getAll(): Promise<Array<Balance>>{
        /*let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }*/
        const sort = ((a: Balance, b: Balance) => {
            if (a.bal_txt_account === 'Capital'){
                return 1;
            }
            return a.bal_txt_account > b.bal_txt_account ? 1 : -1;
        });
        
        return this.sync.get(`${this.apiRoot}${this.config.api.list}`).then(data => {
            this.data = data.map((d: any): Balance => new Balance(d));
            this.data = this.data.sort(sort);
            return this.data;
        });
    }

    getAllForUser(user: string){
        return this.getAll().then((list: Array<Balance>) => {
            return list.filter((x: Balance) => x.bal_id_user === user);
        });
    }

    saveToStorage(){
        // this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newItem(item: Balance): Balance{
        let newItem = new Balance(item);
        this.data.push(newItem);
        this.saveToStorage();
        return newItem;
    }

    add(entryList: Array<Entry>){
        let balance: Array<Balance> = this.list();

        // add up
        entryList.forEach((e: Entry) => {
            let b: Balance = balance.find(b => b.bal_year === e.ent_date.getFullYear() && b.bal_month === e.ent_date.getMonth()+1 && b.bal_id_account === e.ent_id_account && b.bal_id_user === e.ent_id_user);

            if (b) { // exists a balance, add entry amount
                b.bal_charges += e.ent_ctg_type === 2 ? e.ent_amount : 0;
                b.bal_withdrawals += e.ent_ctg_type === 1 ? e.ent_amount : 0;
                b.bal_final += e.ent_ctg_type === 1 ? -1 * e.ent_amount : e.ent_amount;
            } else { // balance does not exist, create one with amount and add it to list
                b = new Balance();
                b.bal_year = e.ent_date.getFullYear();
                b.bal_month = e.ent_date.getMonth() + 1;
                b.bal_id_account = e.ent_id_account;
                b.bal_initial = 0;
                b.bal_charges = e.ent_ctg_type === 2 ? e.ent_amount : 0;
                b.bal_withdrawals = e.ent_ctg_type === 1 ? e.ent_amount : 0;
                b.bal_final = b.bal_charges - b.bal_withdrawals;
                b.bal_id_user = e.ent_id_user;
                b.bal_txt_account = e.ent_txt_account;

                this.data.push(b);
            }
            this.saveToStorage();
        });
    }

    getAllForMonth(year: number, month: number, user: string) : Array<Balance>{
        return this.list().filter((b) => b.bal_year === year && b.bal_month === month);
    }

    rebuild(year: number, month: number, user: string){
        this.entryService.getAllForUser(user).then((entryList: Array<Entry>) => {
            entryList.filter((e) => (new Date(e.ent_date)).getFullYear() === year && (new Date(e.ent_date)).getMonth()+1 === month);
            let balance: Array<Balance> = this.getAllForMonth(year, month, user);
            
            balance.forEach((b: Balance) => {
                b.bal_charges = 0;
                b.bal_withdrawals = 0;
                b.bal_final = b.bal_initial;
            });
    
            // add up
            entryList.forEach((e: Entry) => {
                let b: Balance = balance.find(b => b.bal_id_account === e.ent_id_account);
    
                if (b) { // exists a balance, add entry amount
                    b.bal_charges += e.ent_ctg_type === 2 ? e.ent_amount : 0;
                    b.bal_withdrawals += e.ent_ctg_type === 1 ? e.ent_amount : 0;
                    b.bal_final += e.ent_ctg_type === 1 ? -1 * e.ent_amount : e.ent_amount;
                } else { // balance does not exist, create one with amount and add it to list
                    b = new Balance();
                    b.bal_year = year;
                    b.bal_month = month;
                    b.bal_id_account = e.ent_id_account;
                    b.bal_initial = 0;
                    b.bal_charges = e.ent_ctg_type === 2 ? e.ent_amount : 0;
                    b.bal_withdrawals = e.ent_ctg_type === 1 ? e.ent_amount : 0;
                    b.bal_final = b.bal_charges - b.bal_withdrawals;
                    b.bal_id_user = e.ent_id_user;
                    b.bal_txt_account = e.ent_txt_account;
    
                    this.data.push(b);
                    balance.push(b);
                }
            });
            this.saveToStorage();
        })
    }

    transfer(year: number, month: number, user: string){
        let currentDate = new Date();
        if (year * 100 + month >= currentDate.getFullYear() * 100 + currentDate.getMonth() + 1){
            // cannot transfer current month
            return;
        }
        let balanceCurrent: Array<Balance> = this.getAllForMonth(year, month, user);
        let nextMonth = this.getNextMonth(year, month);
        let balanceNext: Array<Balance> = this.getAllForMonth(nextMonth.year, nextMonth.month, user);

        balanceCurrent.forEach((bc: Balance) => {
            let bn: Balance = balanceNext.find(b => b.bal_id_account === bc.bal_id_account);

            if(bn){
                bn.bal_initial = bc.bal_final;
                bn.bal_final = bn.bal_initial + bn.bal_charges - bn.bal_withdrawals;
                console.log('found a balance record, updated',bn);
            } else {
                bn = new Balance();
                bn.bal_year = nextMonth.year;
                bn.bal_month = nextMonth.month;
                bn.bal_id_account = bc.bal_id_account;
                bn.bal_initial = bc.bal_final;
                bn.bal_charges = 0;
                bn.bal_withdrawals = 0;
                bn.bal_final = bc.bal_final;
                bn.bal_id_user = user;
                bn.bal_txt_account = bc.bal_txt_account;
                
                console.log('new balance record',bn);
                this.data.push(bn);
            }
        });
        this.saveToStorage();
    }

    rebuildAndTransfer(year: number, month: number, user: string){
        this.rebuild(year, month, user);
        this.transfer(year, month, user);
    }

    rebuildAndTransferRange(yearInitial: number, monthInitial: number, yearFinal: number, monthFinal: number, user: string){
        let control = {
            year: yearInitial
            , month: monthInitial
            , iterable: yearInitial * 100 + monthInitial
        }
        while(control.iterable <= yearFinal * 100 + monthFinal){
            this.rebuild(control.year, control.month, user);
            this.transfer(control.year, control.month, user);
            control = this.getNextMonth(control.year, control.month);
        }
    }

    getNextMonth(year: number, month: number){
        if (month === 12){
            return {
                year: year + 1
                , month: 1
                , iterable: (year + 1) * 100 + 1
            };
        } else {
            return {
                year
                , month: month + 1
                , iterable: (year * 100) + month + 1
            };
        }
    }

    parseMonthName(iterable: number){
        let year: number = Math.floor(iterable / 100);
        let month: number = iterable % 100;
        const monthName: string = DateUtils.getMonthName(month);
        return `${year} / ${monthName}`;
    }

    monthList(user: string){
        let iterable: any = this.list()
        .map((b: Balance) => ({
            iterable: b.bal_year * 100 + b.bal_month
            , year: b.bal_year
            , month: b.bal_month
        })).reduce((previous: any, current: any) => {
            return previous.iterable < current.iterable ? previous : current;
        }, 999900);

        if (!iterable){
            iterable = {
                iterable: 201602
                , year: 2016
                , month: 2
            }
        }

        let monthList: Array<any> = [];
        let currentIterable: number = (new Date()).getFullYear() * 100 + ((new Date()).getMonth() + 1);
        while (iterable.iterable <= currentIterable){
            iterable.name = this.parseMonthName(iterable.iterable);
            monthList.push(iterable);
            iterable = this.getNextMonth(iterable.year, iterable.month);
        }
        return monthList.reverse();
    }

    // getPreviousMonth(year: number, month: number){
    //     if (month === 1){
    //         return {
    //             year: year - 1
    //             , month: 12
    //             , iterable: (year - 1) * 100 + 12
    //         };
    //     } else {
    //         return {
    //             year
    //             , month: month - 1
    //             , iterable: (year * 100) + month - 1
    //         };
    //     }
    // }
}