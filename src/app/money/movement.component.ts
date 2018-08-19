import { Component, OnInit, Renderer, transition } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { CurrencyPipe } from '@angular/common';
// types
import { Movement } from '../../crosscommon/entities/Movement';
import { Account } from '../../crosscommon/entities/Account';
import { Catalog } from '../common/catalog.type';
import { Category } from './category.type';
import { Place } from './place.type';
import { Entry } from '../../crosscommon/entities/Entry';
import { Preset } from '../../crosscommon/entities/Preset';
import { iEntity } from '../../crosscommon/iEntity';

// services
import { StorageService }  from '../common/storage.service';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';
import { PlaceService } from './place.service';
import { MovementService } from './movement.service';
import { EntryService } from './entry.service';
import { BalanceService } from './balance.service';
import { PresetService } from './preset.service';

@Component({
    selector: 'movement',
    templateUrl: './movement.template.html',
    providers: [
        AccountService
        , CategoryService
        , PlaceService
        , MovementService
        , EntryService
        , BalanceService
        , PresetService
    ]
})
export class MovementComponent implements OnInit {
    private accounts: Array<Account> = []
    private user: string = 'anon';
    public viewData: {
        accounts: Array<any>
        , types: Array<any>
        , statuses: Array<any>
        , budgets: Array<any>
        , categories: Array<Category>
        , places: Array<Place>
        , movements: Array<Movement>
        , entries: Array<Entry>
        , presets: Array<Preset>
        , showCreateForm: boolean
    } = {
        accounts: []
        , types: []
        , statuses: []
        , budgets: []
        , categories: []
        , places: []
        , movements: []
        , entries: []
        , presets: []
        , showCreateForm: false
    };
    public model: any = { /* UI default form data */
        type: 1
        , date: ''
        , category: 0
        , place: 0
        , asPreset: false
        , selectedPreset: null
        , id: null
    };
    public viewAddCategoryForm: boolean = false;
    public _movementFlowType: string = 'custom';
    public isTransfer: boolean = false;
    public isCustom: boolean = true;
    public isPreset: boolean = false;
    public services: {
        account: AccountService
        , category: CategoryService
        , place: PlaceService
        , movement: MovementService
        , entry: EntryService
        , balance: BalanceService
        , preset: PresetService
    } = {
        account: null,
        category: null,
        place: null,
        movement: null,
        entry: null,
        balance: null,
        preset: null
    };

    constructor(
        accountService: AccountService
        , categoryService: CategoryService
        , placeService: PlaceService
        , movementService: MovementService
        , entryService: EntryService
        , balanceService: BalanceService
        , presetService: PresetService
    ){
        this.services.account = accountService;
        this.services.category = categoryService;
        this.services.place = placeService;
        this.services.movement = movementService;
        this.services.entry = entryService;
        this.services.balance = balanceService;
        this.services.preset = presetService;

        // TODO: this data should come from localStorage, if not present then fetch from BE
        this.viewData.types = [{
            ctg_ctg_value: 1
            , ctg_desc: 'Expense'
        }, {
            ctg_ctg_value: 2
            , ctg_desc: 'Income'
        }, {
            ctg_ctg_value: 3
            , ctg_desc: 'Transfer'
        }];

        // TODO: this data should come from localStorage, if not present then fetch from BE
        this.viewData.statuses = [{
            ctg_ctg_value: 1
            , ctg_desc: 'Active'
        }, {
            ctg_ctg_value: 2
            , ctg_desc: 'Cancelled'
        }, {
            ctg_ctg_value: 3
            , ctg_desc: 'Pending'
        }];

        // TODO: this data should have an entity
        this.viewData.budgets = [
            'Food'
            , 'Services'
            , 'Renewal'
            , 'Groceries'
            , 'Mom'
            , 'Health'
        ];

        this.model.date = this.DateToStringDate(new Date());
    }

    ngOnInit(){
        // TODO: this should be refactored the same way as categories and places
        this.services.account.getAll().then((accounts: Account[]) => {
            this.accounts = accounts;
            this.viewData.accounts = this.accounts;
        });
        this.services.category.getAllForUser(this.user).then((categories: Category[]) => {
            this.viewData.categories = categories;
        });
        this.services.place.getAllForUser(this.user).then((places: Place[]) => {
            this.viewData.places = places;
        });
        this.services.entry.getAllForUser(this.user);
        this.services.preset.getAllForUser(this.user).then((list: Preset[]) => {
            this.viewData.presets = list;
            let p = new Preset();
            p.pre_name = '';
            this.viewData.presets.unshift(p);
        });
        
        this.viewData.entries = this.services.entry.list();
        this.viewData.presets = this.services.preset.list();

        this.addNewCategoryForUser = this.addNewCategoryForUser.bind(this);
        this.addNewPlaceForUser = this.addNewPlaceForUser.bind(this);
        this.services.movement.getAllForUser(this.user).then((list: Array<Movement>) => {
            this.viewData.movements = list;

            this.viewData.movements = this.viewData.movements
            .sort((a: Movement, b: Movement) => a.mov_date >= b.mov_date ? -1 : 1)
            .slice(0,20);
        });
        /* analysis */
        // const year = 2017;
        // const month = 6;
        // let iterable = year * 100 + month;
        // const account = '7';
        // let en = this.services.entry.list;
        // console.log('entries',en);
        // let mov = this.services.movement.list
        //     .filter((m: Movement) => (new Date(m.mov_date)).getFullYear() * 100 + (new Date(m.mov_date)).getMonth() + 1 === iterable);
        // let mon = en.filter((e:Entry) => (new Date(e.ent_date)).getFullYear() * 100 + (new Date(e.ent_date)).getMonth() + 1 === iterable);
        // console.log('movements for 2017march',mov);
        // console.log('entries for 2017march',mon);
        // mov.forEach((m: Movement) => {
        //     if (mon.filter((e: Entry) => e.ent_id === m.mov_id).length === 2){
        //         return;
        //     } else {
        //         console.log('mov not found in entries',m);
        //     }
        // });
        // console.log('entries for Mosho Cartera Income',mon.filter((e: Entry) => e.ent_id_account === account && e.ent_ctg_type == 2));
        // console.log('entries for Mosho Cartera Expense',mon.filter((e: Entry) => e.ent_id_account === account && e.ent_ctg_type == 1));
    }

    movementFlowType(value: string){
        if (!value) {
            return this._movementFlowType;
        }
        this._movementFlowType = value;
        this.isTransfer = false;
        this.isCustom = false;
        this.isPreset = false;
        switch(value){
            case 'custom': {
                this.isCustom = true;
                break;
            }
            case 'transfer': {
                this.isTransfer = true;                
                break;
            }
            case 'preset': {
                this.isPreset = true;
                break;
            }
            default: {

            }
        }
    }

    newMovement(form: NgForm){
        console.log('as preset?',form.value.fAsPreset);
        if (form.value.fAsPreset){
            let p = new Preset();
            // TODO: hash generator for IDs
            p.pre_id = this.services.preset.newId();
            p.pre_name = form.value.fName;
            p.pre_date = this.stringDateToDate(form.value.fDate);
            p.pre_amount = form.value.fAmount;
            p.pre_id_account = form.value.fAccount;
            //p.pre_id_account_to = 0;
            p.pre_ctg_type = form.value.fMovementType;
            p.pre_budget = form.value.fBudget;
            p.pre_id_category = form.value.fCategory;
            p.pre_id_place = form.value.fPlace;
            p.pre_desc = form.value.fDescription;
            p.pre_notes = form.value.fNotes;
            p.pre_id_user = this.user;
            p.pre_ctg_status = 1;

            p.pre_txt_type = this.findIn(this.viewData.types,(e: any) => e.ctg_ctg_value == p.pre_ctg_type,'ctg_desc');
            p.pre_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == p.pre_id_account,'acc_name');
            //p.pre_txt_account_to = '';
            p.pre_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === p.pre_id_category,'mct_name');
            p.pre_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === p.pre_id_place,'mpl_name');
            p.pre_txt_status = this.findIn(this.viewData.statuses,(e: any) =>  e.ctg_ctg_value == p.pre_ctg_status,'ctg_desc');

            this.services.preset.newItem(p);
            this.viewData.presets.push(p);
            console.log('this is the preset',p);
        } else {
            let m = new Movement();
            m.mov_date = this.stringDateToDate(form.value.fDate);
            if (this.model.id) { // we are editing instead of creating a new movement
                m.mov_id = this.model.id;
            } else {
                m.mov_id = this.services.movement.newId(m.mov_date);
            }
            m.mov_desc = form.value.fDescription;
            m.mov_amount = form.value.fAmount;
            m.mov_id_account = form.value.fAccount;
            if (this.isTransfer){
                m.mov_id_account_to = form.value.fAccountTo;
                m.mov_ctg_type = 3;
            } else {
                m.mov_ctg_type = form.value.fMovementType;
            }
            if (!this.isTransfer){
                m.mov_budget = form.value.fBudget;
                m.mov_id_category = form.value.fCategory;
                m.mov_id_place = form.value.fPlace;
            } else {
                m.mov_budget = null;
                m.mov_id_category = '0';
                m.mov_id_place = '0';
            }
            m.mov_notes = form.value.fNotes;
            m.mov_id_user = this.user;
            m.mov_ctg_status = 1;
    
            m.mov_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account,'acc_name');
            if (m.mov_id_account_to){
                m.mov_txt_account_to = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account_to,'acc_name');
            }
            m.mov_txt_type = this.findIn(this.viewData.types,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_type,'ctg_desc');
            //m.mov_txt_budget = m.mov_budget;
            m.mov_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === m.mov_id_category,'mct_name');
            m.mov_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === m.mov_id_place,'mpl_name');
            m.mov_txt_status = this.findIn(this.viewData.statuses,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_status,'ctg_desc');
    
            if (this.model.id) {
                // edition
                const existingIndex: number = this.viewData.movements.findIndex(m => m.mov_id === this.model.id);
                m.mov_date_add = new Date(this.viewData.movements[existingIndex].mov_date_add);
                this.services.movement.edit(m);
                m['isEdited'] = true; // flag to render as edited on UI
                this.viewData.movements[existingIndex] = m;
                this.model.id = null;
            } else {
                // new movement
                this.services.movement.newItem(m);
                m['isNew'] = true; // flag to render as new on UI
                console.log('this is the movement',m);
                this.viewData.movements.unshift(m);
                this.viewData.movements = this.viewData.movements
                    .sort((a: Movement, b: Movement) => (new Date(a.mov_date)).getTime() >= (new Date(b.mov_date)).getTime() ? -1 : 1);
        
                // Entries
                let localEntries: Array<Entry> = [];
                localEntries = this.generateEntriesForMovement(m);
                
                console.log('these are all entries',this.services.entry.list);
                
                // add to balance
                this.services.balance.add(localEntries);
                console.log('these are all balance',this.services.balance.list);
            }
            form.reset();
            form.controls['fMovemementFlowType'].setValue('custom');
            form.controls['fMovemementType'].setValue('1');
            form.controls['fDate'].setValue(this.DateToStringDate(new Date()));
            return false;
        }
    }
            
    generateEntriesForMovement(m: Movement): Array<Entry>{
        let localEntries: Array<Entry> = [];
        // TODO: Entry creation should be inside entry.service, just pass the movement as argument
        let e = new Entry();
        e.ent_id = m.mov_id;
        e.ent_sequential = 1;
        e.ent_desc = m.mov_desc;
        e.ent_amount = m.mov_amount;
        e.ent_id_account = m.mov_id_account;
        e.ent_ctg_type = m.mov_ctg_type === 3 ? 1 : m.mov_ctg_type;
        e.ent_date = m.mov_date;
        e.ent_budget = m.mov_budget;
        e.ent_id_category = m.mov_id_category;
        e.ent_id_place = m.mov_id_place;
        e.ent_notes = m.mov_notes;
        e.ent_id_user = m.mov_id_user;
        e.ent_ctg_status = m.mov_ctg_status;

        e.ent_txt_account = m.mov_txt_account;
        e.ent_txt_type = m.mov_txt_type;
        //e.ent_txt_budget = m.mov_txt_budget;
        e.ent_txt_category = m.mov_txt_category;
        e.ent_txt_place = m.mov_txt_place;
        e.ent_txt_status = m.mov_txt_status;

        localEntries.push(this.services.entry.newItem(e));
        
        e = new Entry();
        e.ent_id = m.mov_id;
        e.ent_sequential = 2;
        e.ent_desc = m.mov_desc;
        e.ent_amount = m.mov_amount;
        e.ent_id_account = m.mov_id_account_to || "1";
        e.ent_ctg_type = m.mov_ctg_type === 1 || m.mov_ctg_type === 3 ? 2 : 1;
        e.ent_date = m.mov_date;
        e.ent_budget = m.mov_budget;
        e.ent_id_category = m.mov_id_category;
        e.ent_id_place = m.mov_id_place;
        e.ent_notes = m.mov_notes;
        e.ent_id_user = m.mov_id_user;
        e.ent_ctg_status = m.mov_ctg_status;
        
        e.ent_txt_account = this.findIn(this.viewData.accounts,(i: any) => i.acc_id == e.ent_id_account,'acc_name');
        e.ent_txt_type = this.findIn(this.viewData.types,(i: any) => i.ctg_ctg_value == e.ent_ctg_type,'ctg_desc');
        //e.ent_txt_budget = m.mov_txt_budget;
        e.ent_txt_category = m.mov_txt_category;
        e.ent_txt_place = m.mov_txt_place;
        e.ent_txt_status = m.mov_txt_status;
        
        localEntries.push(this.services.entry.newItem(e));

        return localEntries;
    }

    // TODO: local methods that can be used as generic should be moved to utils.service
    findIn(arr: Array<any>, findCriteria: Function, returnField: string){
        const f = arr.find((e: any) => findCriteria(e));
        if (f) {
            return f[returnField];
        } else {
            return undefined;
        }
    }

    stringDateToDate(date: string){
        if(/\d{4}-\d{2}-\d{2}/.test(date)){ // looks like a date
            const s: Array<string> = date.split('-');
            return new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
        }
        return undefined;
    }

    DateToStringDate(date: Date){
        const mm = date.getMonth() + 1;
        const dd = date.getDate();

        return [date.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
                ].join('-');
    }

    addNewCategoryForUser(category: string){
        this.services.category.newItem(category, this.user).then((item: Category) => {
            this.viewData.categories = this.services.category.list();
            this.model.category = item.mct_id;
        });
    }
    
    addNewPlaceForUser(place: string){
        this.services.place.newItem(place, this.user).then((item: Place) => {
            this.viewData.places = this.services.place.list();
            this.model.place = item.mpl_id;
        });
    }

    /*selectPreset(presetId: string, form: any){
        this.services.preset.getAll().then((list: Preset[]) => {
            let preset: Preset = list.find((p: Preset) => p.pre_id === presetId);
            let fields: Array<any> = [
                {
                    'control': 'fDescription'
                    , 'value': 'pre_desc'
                },{
                    'control': 'fAmount'
                    , 'value': 'pre_amount'
                },{
                    'control': 'fAccount'
                    , 'value': 'pre_id_account'
                },{
                    'control': 'fAccountTo'
                    , 'value': 'pre_id_account_to'
                },{
                    'control': 'fMovementType'
                    , 'value': 'pre_ctg_type'
                },{
                    'control': 'fDate'
                    , 'value': 'pre_date'
                },{
                    'control': 'fBudget'
                    , 'value': 'pre_budget'
                },{
                    'control': 'fCategory'
                    , 'value': 'pre_id_category'
                },{
                    'control': 'fPlace'
                    , 'value': 'pre_id_place'
                },{
                    'control': 'fNotes'
                    , 'value': 'pre_notes'
                }
            ];
    
            fields.forEach((f: any) => {
                if (form.controls[f.control] && preset[f.value]){
                    form.controls[f.control].setValue(preset[f.value]);
                }
            });
        });
    }*/

    cancelMovement(){
        // TODO: upon cancellation, change status, modify other movement references to filter active movements, rebuild and transfer
    }

    import(dataArray: Array<string>){
        // imports raw data
        var data: Array<string> = dataArray;
        //let movements: Array<Movement> = [];
        let m: Movement;
        let transferFlag: boolean = false;
        let yearInitial: number = 9999;
        let monthInitial: number = 0;
        let yearFinal: number = (new Date()).getFullYear();
        let monthFinal: number = (new Date()).getMonth() + 1;
        let movements: Array<Movement> = [];
        let categories: Array<string> = [];
        //let place: string;

        // categories and places
        data.forEach((d: string, index: number, arr: string[]) => {
            let values: Array<string> = d.split('|');
            if (!this.findIn(this.services.category.list(),(e: Category) => e.mct_name === values[5],'mct_id')){
                this.services.category.newItem(values[5],this.user);
            }
            if (!this.findIn(this.services.place.list(),(e: Place) => e.mpl_name === values[6],'mpl_id')){
                this.services.place.newItem(values[6],this.user);
            }
        });
        this.viewData.categories = this.services.category.list();
        this.viewData.places = this.services.place.list();

        data.forEach((d: string, index: number, arr: string[]) => {
            try {
                let values: Array<string> = d.split('|');
                if (transferFlag && values[5] === 'Traspaso'){
                    transferFlag = false;
                    return;
                }
                m = new Movement();
                
                //m.mov_id = this.services.movement.newId();
                m.mov_desc = values[7];
                m.mov_amount = parseFloat(values[3]);
                if (this.findIn(this.viewData.accounts,(e: any) => e.acc_name == values[1],'acc_id')){
                    m.mov_id_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_name == values[1],'acc_id');
                } else {
                    console.log('account not found',values[1],d);
                }
                m.mov_date = this.stringDateToDate(values[0]);
                if (yearInitial * 100 + monthInitial > m.mov_date.getFullYear() * 100 + (m.mov_date.getMonth() + 1)){
                    yearInitial = m.mov_date.getFullYear();
                    monthInitial = m.mov_date.getMonth() + 1;
                }
                if (values[5] === 'Traspaso' && arr[index+1] && arr[index+1].split('|')[5] === "Traspaso" && arr[index+1].split('|')[7] === values[7] && arr[index+1].split('|')[3] === values[3]){
                    transferFlag = true;
                    m.mov_ctg_type = 3;
                    // peek next item
                    // if (arr[index+1] && arr[index+1].split('|')[5] === "Traspaso" && arr[index+1].split('|')[7] === values[7]){
                         m.mov_id_account_to = this.findIn(this.viewData.accounts,(e: any) => e.acc_name == arr[index+1].split('|')[1],'acc_id');
                    // }
                    // Transfers always have to be expense first, income later, fix when provided the other way around
                    if (values[2] === 'CARGO'){
                        // swap accounts
                        let temp = m.mov_id_account;
                        m.mov_id_account = m.mov_id_account_to;
                        m.mov_id_account_to = temp;
                    }
                    m.mov_id_category = '0';
                    m.mov_id_place = '0';
                } else {
                    m.mov_ctg_type = values[2] === 'ABONO' ? 1 : 2;
                    m.mov_budget = '' + ((m.mov_date.getFullYear() * 100) + (m.mov_date.getMonth() + 1));
                    m.mov_id_category = this.findIn(this.viewData.categories,(e: any) => e.mct_name === values[5],'mct_id');
                    m.mov_id_place = this.findIn(this.viewData.places,(e: any) => e.mpl_name === values[6],'mpl_id');
                }
                m.mov_notes = '';
                m.mov_id_user = this.user;
                m.mov_ctg_status = 1;
                m.mov_date_add = new Date();
                m.mov_date_mod = new Date();
        
                m.mov_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account,'acc_name');
                if (m.mov_id_account_to){
                    m.mov_txt_account_to = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account_to,'acc_name');
                }
                m.mov_txt_type = this.findIn(this.viewData.types,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_type,'ctg_desc');
                //m.mov_txt_budget = m.mov_budget;
                m.mov_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === m.mov_id_category,'mct_name');
                m.mov_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === m.mov_id_place,'mpl_name');
                m.mov_txt_status = this.findIn(this.viewData.statuses,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_status,'ctg_desc');
                
                movements.push(m);
                // this.services.movement.newItem(m);
                // this.generateEntriesForMovement(m);
            } catch(e) {
                console.log('err',e);
            }
        });

        this.services.movement.newBatch(movements).forEach((m: Movement) => {
            this.generateEntriesForMovement(m);
        });

        // now apply to balance
        this.services.balance.rebuildAndTransferRange(yearInitial,monthInitial,yearFinal,monthFinal,this.user);
    }
    setModelDetails(id: string, form: any, prefix: string){
        let model: iEntity;
        if (!this.viewData.showCreateForm) {
            this.viewData.showCreateForm = !this.viewData.showCreateForm;
        }

        if (prefix === 'pre'){
            model = this.viewData.presets
                .find((m: Preset) => m.pre_id === id);
        } else {
            model = this.viewData.movements
                .find((m: Movement) => m.mov_id === id);
            this.model.id = model[prefix + '_id']; // to tell the newMovementForm that this is an edition
        }

        if (model[prefix + '_ctg_type'] === 3){
            this.movementFlowType('transfer');
        } else {
            this.movementFlowType('custom');
        }

    
        let fields: Array<any> = [
            {
                'control': 'fDescription'
                , 'value': '_desc'
            },{
                'control': 'fAmount'
                , 'value': '_amount'
            },{
                'control': 'fAccount'
                , 'value': '_id_account'
            },{
                'control': 'fAccountTo'
                , 'value': '_id_account_to'
            },{
                'control': 'fMovementType'
                , 'value': '_ctg_type'
            },{
                'control': 'fDate'
                , 'value': '_date'
            },{
                'control': 'fBudget'
                , 'value': '_budget'
            },{
                'control': 'fCategory'
                , 'value': '_id_category'
            },{
                'control': 'fPlace'
                , 'value': '_id_place'
            },{
                'control': 'fNotes'
                , 'value': '_notes'
            }
        ];
        setTimeout(() => {
            fields.forEach((f: any) => {
                if (form.controls[f.control]){
                    if (f.value === '_date'){
                        form.controls[f.control].setValue(this.DateToStringDate(new Date(model[prefix + f.value])));
                    } else {
                        form.controls[f.control].setValue(model[prefix + f.value] || null);
                    }
                }
            });
        }, 0);
    }

}