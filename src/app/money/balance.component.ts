import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { Balance } from './balance.type';

// services
import { StorageService }  from '../common/storage.service';
import { BalanceService } from './balance.service';

@Component({
    selector: 'balance',
    templateUrl: './balance.template.html',
    styleUrls: ['./balance.css'],
    providers: [
        BalanceService
    ]
})
export class BalanceComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        balance: Array<Balance>
        , monthBalance: Array<Balance>
        , monthList: Array<any>
        , filterNonZero: boolean
    } = {
        balance: []
        , monthBalance: []
        , monthList: []
        , filterNonZero: true
    };
    public services: {
        balance: BalanceService
    } = {
        balance: null
    };
    public model: {
        iterable: number
        , year: number
        , month: number
    } = {
        iterable: 0
        , year: 2017
        , month: 12
    };

    constructor(
        balanceService: BalanceService
    ){
        this.services.balance = balanceService;
    }

    ngOnInit(){
        this.model.iterable = (new Date()).getFullYear() * 100 + ((new Date()).getMonth() + 1);
        this.parseIterable();

        this.services.balance.getAllForUser(this.user).then((list: Array<Balance>) => {
            this.viewData.balance = list;

            /*this.viewData.balance = this.viewData.balance
            .sort((a: Balance, b: Balance) => a.mov_date >= b.mov_date ? -1 : 1)
            .slice(0,10);*/
            this.viewData.monthBalance = this.filterMonthBalance();
            //this.viewData.monthBalance = this.services.balance.list;
            // TODO: add list of year/months of balance for combo box
            this.viewData.monthList = this.services.balance.monthList(this.user);
        });
        
    }

    parseIterable(){
        this.model.year = Math.floor(this.model.iterable / 100);
        this.model.month = this.model.iterable % 100;
    }

    reloadBalance(){
        this.parseIterable();
        this.viewData.monthBalance = this.filterMonthBalance();
    }

    filterMonthBalance(){
        let filter = (b: Balance) => b.bal_year == this.model.year && b.bal_month == this.model.month;
        if (this.viewData.filterNonZero){
            filter = (b: Balance) => b.bal_year == this.model.year && b.bal_month == this.model.month && b.bal_final !== 0;
        }
        
        return this.services.balance.list.filter((b: Balance) => filter(b));
    }

    toggleFilterNonZero(){
        this.viewData.filterNonZero = !this.viewData.filterNonZero;
        this.viewData.monthBalance = this.filterMonthBalance();
    }
}