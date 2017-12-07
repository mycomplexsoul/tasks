import { Component, OnInit, Renderer, transition } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { CurrencyPipe } from '@angular/common';
// types
import { Movement } from './movement.type';
import { Account } from './account.type';
import { Catalog } from '../common/catalog.type';
import { Category } from './category.type';
import { Place } from './place.type';
import { Entry } from './entry.type';
import { Preset } from './preset.type';

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
    };
    public model: any = { /* UI default form data */
        type: 1
        , date: ''
        , category: 0
        , place: 0
        , asPreset: false
        , selectedPreset: null
    };
    public viewAddCategoryForm: boolean = false;
    public _movementFlowType: string = 'custom';
    public isTransfer: boolean = false;
    public isCustom: boolean = true;
    public isPreset: boolean = false;
    public services = {
        account: <AccountService>null
        , category: <CategoryService>null
        , place: <PlaceService>null
        , movement: <MovementService>null
        , entry: <EntryService>null
        , balance: <BalanceService>null
        , preset: <PresetService>null
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
        this.accounts = this.services.account.getAll();
        this.services.category.getAllForUser(this.user);
        this.services.place.getAllForUser(this.user);
        this.services.movement.getAllForUser(this.user);
        this.services.entry.getAllForUser(this.user);
        this.services.preset.getAllForUser(this.user);
        
        this.viewData.accounts = this.accounts;
        this.viewData.categories = this.services.category.list;
        this.viewData.places = this.services.place.list;
        this.viewData.movements = this.services.movement.list;
        this.viewData.entries = this.services.entry.list;
        this.viewData.presets = this.services.preset.list;

        this.addNewCategoryForUser = this.addNewCategoryForUser.bind(this);
        this.addNewPlaceForUser = this.addNewPlaceForUser.bind(this);
    }

    get movementFlowType(){
        return this._movementFlowType;
    }

    set movementFlowType(value: string){
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
            p.pre_ctg_category = form.value.fCategory;
            p.pre_ctg_place = form.value.fPlace;
            p.pre_desc = form.value.fDescription;
            p.pre_notes = form.value.fNotes;
            p.pre_id_user = this.user;
            p.pre_ctg_status = 1;

            p.pre_txt_type = this.findIn(this.viewData.types,(e: any) => e.ctg_ctg_value == p.pre_ctg_type,'ctg_desc');
            p.pre_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == p.pre_id_account,'acc_name');
            //p.pre_txt_account_to = '';
            p.pre_txt_budget = p.pre_budget;
            p.pre_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === p.pre_ctg_category,'mct_name');
            p.pre_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === p.pre_ctg_place,'mpl_name');
            p.pre_txt_status = this.findIn(this.viewData.statuses,(e: any) =>  e.ctg_ctg_value == p.pre_ctg_status,'ctg_desc');

            this.services.preset.newItem(p);
            console.log('this is the preset',p);
        } else {
            let m = new Movement();
            // TODO: implement a hash generator for IDs
            m.mov_id = this.services.movement.newId();
            m.mov_desc = form.value.fDescription;
            m.mov_amount = form.value.fAmount;
            m.mov_id_account = form.value.fAccount;
            if (this.isTransfer){
                m.mov_id_account_to = form.value.fAccountTo;
                m.mov_ctg_type = 1;
            } else {
                m.mov_ctg_type = form.value.fMovementType;
            }
            m.mov_date = this.stringDateToDate(form.value.fDate);
            if (!this.isTransfer){
                m.mov_budget = form.value.fBudget;
                m.mov_ctg_category = form.value.fCategory;
                m.mov_ctg_place = form.value.fPlace;
            } else {
                m.mov_budget = null;
                m.mov_ctg_category = 0;
                m.mov_ctg_place = 0;
            }
            m.mov_notes = form.value.fNotes;
            m.mov_id_user = this.user;
            m.mov_ctg_status = 1;
    
            m.mov_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account,'acc_name');
            if (m.mov_id_account_to){
                m.mov_txt_account_to = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_id_account_to,'acc_name');
            }
            m.mov_txt_type = this.findIn(this.viewData.types,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_type,'ctg_desc');
            m.mov_txt_budget = m.mov_budget;
            m.mov_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === m.mov_ctg_category,'mct_name');
            m.mov_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === m.mov_ctg_place,'mpl_name');
            m.mov_txt_status = this.findIn(this.viewData.statuses,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_status,'ctg_desc');
    
            this.services.movement.newItem(m);
            console.log('this is the movement',m);
    
            // Entries
            let localEntries: Array<Entry> = [];
            // TODO: Entry creation should be inside entry.service, just pass the movement as argument
            let e = new Entry();
            e.ent_id = m.mov_id;
            e.ent_sequential = 1;
            e.ent_desc = m.mov_desc;
            e.ent_amount = m.mov_amount;
            e.ent_id_account = m.mov_id_account;
            e.ent_ctg_type = m.mov_ctg_type;
            e.ent_date = m.mov_date;
            e.ent_budget = m.mov_budget;
            e.ent_ctg_category = m.mov_ctg_category;
            e.ent_ctg_place = m.mov_ctg_place;
            e.ent_notes = m.mov_notes;
            e.ent_id_user = m.mov_id_user;
            e.ent_ctg_status = m.mov_ctg_status;
    
            e.ent_txt_account = m.mov_txt_account;
            e.ent_txt_type = m.mov_txt_type;
            e.ent_txt_budget = m.mov_txt_budget;
            e.ent_txt_category = m.mov_txt_category;
            e.ent_txt_place = m.mov_txt_place;
            e.ent_txt_status = m.mov_txt_status;
    
            localEntries.push(this.services.entry.newItem(e));
            
            e = new Entry();
            e.ent_id = m.mov_id;
            e.ent_sequential = 2;
            e.ent_desc = m.mov_desc;
            e.ent_amount = m.mov_amount;
            if (this.isTransfer){
                e.ent_id_account = m.mov_id_account_to;
                e.ent_ctg_type = 2;
            } else {
                e.ent_id_account = "1";
                e.ent_ctg_type = m.mov_ctg_type === 1 ? 2 : 1;
            }        
            e.ent_date = m.mov_date;
            e.ent_budget = m.mov_budget;
            e.ent_ctg_category = m.mov_ctg_category;
            e.ent_ctg_place = m.mov_ctg_place;
            e.ent_notes = m.mov_notes;
            e.ent_id_user = m.mov_id_user;
            e.ent_ctg_status = m.mov_ctg_status;
            
            e.ent_txt_account = this.findIn(this.viewData.accounts,(i: any) => i.acc_id == e.ent_id_account,'acc_name');
            e.ent_txt_type = this.findIn(this.viewData.types,(i: any) => i.ctg_ctg_value == e.ent_ctg_type,'ctg_desc');
            e.ent_txt_budget = m.mov_txt_budget;
            e.ent_txt_category = m.mov_txt_category;
            e.ent_txt_place = m.mov_txt_place;
            e.ent_txt_status = m.mov_txt_status;
            
            localEntries.push(this.services.entry.newItem(e));
    
            console.log('these are all entries',this.services.entry.list);
            
            // add to balance
            this.services.balance.add(localEntries);
            console.log('these are all balance',this.services.balance.list);

            // if movement applies to other than current month
            // rebuild until current month
            let currentDate: Date = new Date();
            if (currentDate.getFullYear() * 100 + currentDate.getMonth() > m.mov_date.getFullYear() * 100 + m.mov_date.getMonth()){
                this.services.balance.rebuildAndTransferRange(m.mov_date.getFullYear(), m.mov_date.getMonth() + 1, currentDate.getFullYear(), currentDate.getMonth() + 1, this.user);
            }
        }

        //form.reset();
        // this.movementFlowType = 'custom';
        // this.model.type = '1';
        // this.model.date = this.DateToStringDate(new Date());
        return false;
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
        let id = this.services.category.newItem(category, this.user).mct_id;
        this.model.category = id;
    }
    
    addNewPlaceForUser(place: string){
        let id = this.services.place.newItem(place, this.user).mpl_id;
        this.model.place = id;
    }

    selectPreset(presetId: string, form: any){
        let preset: Preset = this.services.preset.getAll()
            .find((p: Preset) => p.pre_id === presetId);
        
        let fields: Array<any> = [{
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
        }/*,{
            'control': 'fDate'
            , 'value': 'pre_date'
        }*/,{
            'control': 'fBudget'
            , 'value': 'pre_budget'
        },{
            'control': 'fCategory'
            , 'value': 'pre_ctg_category'
        },{
            'control': 'fPlace'
            , 'value': 'pre_ctg_place'
        },{
            'control': 'fNotes'
            , 'value': 'pre_notes'
        }];

        fields.forEach((f: any) => {
            if (form.controls[f.control] && preset[f.value]){
                form.controls[f.control].setValue(preset[f.value]);
            }
        });
    }

    cancelMovement(){
        // TODO: upon cancellation, change status, modify other movement references to filter active movements, rebuild and transfer
    }
}