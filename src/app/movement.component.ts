import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { Movement } from './movement.type';
import { Account } from './account.type';
import { Catalog } from './catalog.type';
import { Category } from './category.type';
import { Place } from './place.type';
import { Entry } from './entry.type';
// services
import { StorageService }  from './storage.service';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';
import { PlaceService } from './place.service';
import { MovementService } from './movement.service';

@Component({
    selector: 'movement',
    templateUrl: './movement.template.html',
    providers: [
        AccountService
        , CategoryService
        , PlaceService
        , MovementService
    ]
})
export class MovementComponent implements OnInit {
    public entryList: Array<Entry> = [];
    private accounts: Array<Account> = [] //this.getAccounts();
    private user: string = 'anon';
    public viewData: {
        accounts: Array<any>
        , types: Array<any>
        , budgets: Array<any>
        , categories: Array<Category>
        , places: Array<Place>
        , movements: Array<Movement>
    } = {
        accounts: []
        , types: []
        , budgets: []
        , categories: []
        , places: []
        , movements: []
    };
    public model: any = { /* UI default form data */
        type: 1
        , date: ''
        , category: 0
        , place: 0
        , movementFlowType: 'custom'
    };
    public viewAddCategoryForm: boolean = false;
    public services = {
        account: <AccountService>null
        , category: <CategoryService>null
        , place: <PlaceService>null
        , movement: <MovementService>null
    };

    constructor(
        accountService: AccountService
        , categoryService: CategoryService
        , placeService: PlaceService
        , movementService: MovementService
    ){
        this.services.account = accountService;
        this.services.category = categoryService;
        this.services.place = placeService;
        this.services.movement = movementService;

        /*let a = new Movement(undefined);
        a.mov_id = "1";
        a.mov_date = new Date(2017,4,8,16,54,0);
        a.mov_amount = 100.00;
        a.mov_account = 2;
        a.mov_txt_account = 'Cartera';
        a.mov_ctg_type = 1;
        a.mov_txt_type = 'Income';
        a.mov_budget = '1705-Other';
        a.mov_ctg_category = 1;
        a.mov_ctg_place = 1;
        a.mov_desc = 'Initial Balance';
        a.mov_notes = null;

        this.movementList.push(a);*/

        // TODO: this data should come from localStorage, if not present then fetch from BE
        this.viewData.types = [{
            ctg_ctg_value: 1
            , ctg_desc: 'Expense'
        }, {
            ctg_ctg_value: 2
            , ctg_desc: 'Income'
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
        
        this.viewData.accounts = this.accounts;
        this.viewData.categories = this.services.category.list;
        this.viewData.places = this.services.place.list;
        this.viewData.movements = this.services.movement.list;

        this.addNewCategoryForUser = this.addNewCategoryForUser.bind(this);
        this.addNewPlaceForUser = this.addNewPlaceForUser.bind(this);
    }

    newMovement(form: NgForm){
        let m = new Movement(undefined);
        // TODO: implement a hash generator for IDs
        m.mov_id = this.services.movement.newId();
        m.mov_desc = form.value.fDescription;
        m.mov_amount = form.value.fAmount;
        m.mov_account = form.value.fAccount;
        m.mov_ctg_type = form.value.fMovementType;
        m.mov_date = this.stringDateToDate(form.value.fDate);
        m.mov_budget = form.value.fBudget;
        m.mov_ctg_category = form.value.fCategory;
        m.mov_ctg_place = form.value.fPlace;
        m.mov_notes = form.value.fNotes;

        m.mov_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == m.mov_account,'acc_name');
        m.mov_txt_type = this.findIn(this.viewData.types,(e: any) =>  e.ctg_ctg_value == m.mov_ctg_type,'ctg_desc');
        m.mov_txt_budget = m.mov_budget;
        m.mov_txt_category = this.findIn(this.viewData.categories,(e: any) => e.mct_id === m.mov_ctg_category,'mct_name');
        m.mov_txt_place = this.findIn(this.viewData.places,(e: any) => e.mpl_id === m.mov_ctg_place,'mpl_name');

        this.services.movement.newItem(m);

        // Entries
        let e = new Entry();
        e.ent_id = m.mov_id;
        e.ent_sequential = 1;
        e.ent_desc = m.mov_desc;
        e.ent_amount = m.mov_amount;
        e.ent_account = m.mov_account;
        e.ent_ctg_type = m.mov_ctg_type;
        e.ent_date = m.mov_date;
        e.ent_budget = m.mov_budget;
        e.ent_ctg_category = m.mov_ctg_category;
        e.ent_ctg_place = m.mov_ctg_place;
        e.ent_notes = m.mov_notes;

        e.ent_txt_account = m.mov_txt_account;
        e.ent_txt_type = m.mov_txt_type;
        e.ent_txt_budget = m.mov_txt_budget;
        e.ent_txt_category = m.mov_txt_category;
        e.ent_txt_place = m.mov_txt_place;

        this.entryList.push(e);

        e = new Entry();
        e.ent_id = m.mov_id;
        e.ent_sequential = 2;
        e.ent_desc = m.mov_desc;
        e.ent_amount = m.mov_amount;
        e.ent_account = 1;
        e.ent_ctg_type = m.mov_ctg_type === 1 ? 2 : 1;
        e.ent_date = m.mov_date;
        e.ent_budget = m.mov_budget;
        e.ent_ctg_category = m.mov_ctg_category;
        e.ent_ctg_place = m.mov_ctg_place;
        e.ent_notes = m.mov_notes;

        e.ent_txt_account = this.findIn(this.viewData.accounts,(e: any) => e.acc_id == e.ent_account,'acc_name');
        e.ent_txt_type = this.findIn(this.viewData.types,(e: any) =>  e.ctg_ctg_value == e.ent_ctg_type,'ctg_desc');
        e.ent_txt_budget = m.mov_txt_budget;
        e.ent_txt_category = m.mov_txt_category;
        e.ent_txt_place = m.mov_txt_place;

        this.entryList.push(e);
        // TODO: Entries should be using a service and saved to Storage

        console.log(this.entryList);

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

}