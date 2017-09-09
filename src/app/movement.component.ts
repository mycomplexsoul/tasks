import { Component, OnInit, Renderer } from '@angular/core';
import { Movement } from './movement.type';
import { Account } from './account.type';
import { Catalog } from './catalog.type';
import { Category } from './category.type';
import { Entry } from './entry.type';
import { NgForm } from '@angular/forms';
import { StorageService }  from './storage.service';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';

@Component({
    selector: 'movement',
    templateUrl: './movement.template.html',
    providers: [ AccountService, CategoryService ]
})
export class MovementComponent implements OnInit {
    public movementList: Array<Movement> = [];
    public entryList: Array<Entry> = [];
    private accounts: Array<Account> = [] //this.getAccounts();
    private user: string = 'anon';
    private categories: Array<Category> = []; //this.getCategoriesForUser(this.user);
    private places: Array<Place> = this.getPlacesForUser(this.user);
    public viewData = {
        accounts: <any>[]
        , types: <any>[]
        , budgets: <any>[]
        , categories: this.categories
        , places: this.places
    };
    public model: any = { /* UI default form data */
        type: 1
        , date: ''
        , category: 0
    };
    public viewAddCategoryForm: boolean = false;
    public services = {
        account: <AccountService>null
        , category: <CategoryService>null
    };

    constructor(accountService: AccountService, categoryService: CategoryService){
        this.services.account = accountService;
        this.services.category = categoryService;

        let a = new Movement(undefined);
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

        this.movementList.push(a);

        this.viewData.types = [{
            ctg_ctg_value: 1
            , ctg_desc: 'Expense'
        }, {
            ctg_ctg_value: 2
            , ctg_desc: 'Income'
        }];

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
        this.accounts = this.services.account.getAll(); // this.getAccounts();
        this.viewData.accounts = this.accounts;
        this.categories = this.services.category.getAllForUser(this.user); // this.getAccounts();
        this.viewData.categories = this.categories;
    }

    newMovement(form: NgForm){
        let m = new Movement(undefined);
        m.mov_id = (this.movementList.length + 1) + '';
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
        m.mov_txt_category = this.findIn(this.viewData.categories,(e: any) => e.ctg_id === 'MONEY_CATEGORIES' && e.ctg_sequential == m.mov_ctg_category,'ctg_name');
        m.mov_txt_place = this.findIn(this.viewData.places,(e: any) => e.ctg_id === 'MONEY_PLACES' && e.ctg_sequential == m.mov_ctg_place,'ctg_name');

        this.movementList.push(m);

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

        console.log(this.entryList);

        return false;
    }

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

    /*getAccounts(): Array<Account>{
        return this.services.account.getAll();
    }*/

    /*getCatalog(catalogName: string): Array<Catalog>{
        let list: Array<Catalog>;
        // data
        let data = this.getCatalogList().filter((e) => e.ctg_id === catalogName);
        
        list = data.map((d: any) => new Catalog(d));

        return list;
    }

    getCatalogList(){
        return [{
            ctg_id: 'MONEY_CATEGORIES'
            , ctg_sequential: 1
            , ctg_name: 'Food'
        }, {
            ctg_id: 'MONEY_CATEGORIES'
            , ctg_sequential: 2
            , ctg_name: 'Services'
        }, {
            ctg_id: 'MONEY_CATEGORIES'
            , ctg_sequential: 3
            , ctg_name: 'Groceries'
        }, {
            ctg_id: 'MONEY_PLACES'
            , ctg_sequential: 1
            , ctg_name: 'Walmart'
        }, {
            ctg_id: 'MONEY_PLACES'
            , ctg_sequential: 2
            , ctg_name: 'Vips'
        }, {
            ctg_id: 'MONEY_PLACES'
            , ctg_sequential: 3
            , ctg_name: 'Sams Club'
        }, {
            ctg_id: 'MONEY_PLACES'
            , ctg_sequential: 4
            , ctg_name: 'Cinepolis'
        }];
    }*/

    getPlacesForUser(user: string){
        const all: Array<Place> = [];
        const user1 = 'anon';
        all.push(new Place(1,'Walmart',user1));
        all.push(new Place(2,'Vips',user1));
        all.push(new Place(3,'Sams Club',user1));
        all.push(new Place(4,'Cinepolis',user1));
        all.push(new Place(4,'The Home Depot',user1));
        
        return all.filter((x: Place) => x.mpl_user === user);
    }

    addNewCategoryForUser(category: string, user: string){
        let newId: string = this.categories.length + 1 + '';
        this.categories.push(new Category({mct_id: newId,mct_name: category,mct_user: user}));
        this.model.category = newId;
    }

}

class Place {
    public mpl_id: number;
    public mpl_name: string;
    public mpl_user: string;

    constructor(mpl_id: number,mpl_name: string,mpl_user: string){
        this.mpl_id = mpl_id;
        this.mpl_name = mpl_name;
        this.mpl_user = mpl_user;
    }
}