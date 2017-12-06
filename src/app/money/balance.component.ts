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
    providers: [
        BalanceService
    ]
})
export class BalanceComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        balance: Array<Balance>
        , monthBalance: Array<Balance>
    } = {
        balance: []
        , monthBalance: []
    };
    public services = {
        balance: <BalanceService>null
    };
    public model: {
        year: number
        , month: number
    } = {
        year: 2017
        , month: 12
    };

    constructor(
        balanceService: BalanceService
    ){
        this.services.balance = balanceService;
    }

    ngOnInit(){
        this.services.balance.getAllForUser(this.user);
        this.model.year = (new Date()).getFullYear();
        this.model.month = (new Date()).getMonth();
        
        this.viewData.balance = this.services.balance.list;
        this.viewData.monthBalance = this.services.balance.list.filter((b: Balance) => {
            return b.bal_year == this.model.year && b.bal_month == this.model.month;
        });
        //this.viewData.monthBalance = this.services.balance.list;
        // TODO: add list of year/months of balance for combo box
    }

    reloadBalance(){
        this.viewData.monthBalance = this.services.balance.list.filter((b: Balance) => {
            return b.bal_year == this.model.year && b.bal_month == this.model.month;
        });
    }
}