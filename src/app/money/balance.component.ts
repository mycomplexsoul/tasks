import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
// types
import { Balance } from '../../crosscommon/entities/Balance';
import { Movement } from '../../crosscommon/entities/Movement';

// services
import { StorageService }  from '../common/storage.service';
import { BalanceService } from './balance.service';
import { MovementService } from './movement.service';

@Component({
    selector: 'balance',
    templateUrl: './balance.template.html',
    styleUrls: ['./balance.css'],
    providers: [
        BalanceService
        , MovementService
    ]
})
export class BalanceComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        balance: Array<Balance>
        , movements: Array<Movement>
        , monthBalance: Array<Balance>
        , monthList: Array<any>
        , filterNonZero: boolean
    } = {
        balance: []
        , movements: []
        , monthBalance: []
        , monthList: []
        , filterNonZero: true
    };
    public services: {
        balance: BalanceService
        , movement: MovementService
    } = {
        balance: null
        , movement: null
    };
    public model: {
        iterable: number
        , year: number
        , month: number
        , selectedBalance: Balance
        , movementListingView: string
    } = {
        iterable: 0
        , year: 2017
        , month: 12
        , selectedBalance: null
        , movementListingView: 'compact'
    };

    constructor(
        balanceService: BalanceService
        , movementService: MovementService
        , private titleService: Title
    ){
        this.services.balance = balanceService;
        this.services.movement = movementService;

        titleService.setTitle('Balance');
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
        if (this.model.selectedBalance) {
            this.model.selectedBalance = this.viewData.balance.find(b => b.bal_id_account === this.model.selectedBalance.bal_id_account && b.bal_year === this.model.year && b.bal_month === this.model.month);
            this.renderMovements(this.model.selectedBalance, undefined);
        }
    }

    filterMonthBalance(){
        let filter = (b: Balance) => b.bal_year == this.model.year && b.bal_month == this.model.month;
        if (this.viewData.filterNonZero){
            filter = (b: Balance) => b.bal_year == this.model.year && b.bal_month == this.model.month
                && !(b.bal_initial === 0 && b.bal_charges === 0 && b.bal_withdrawals === 0 && b.bal_final === 0);
        }
        
        return this.services.balance.list().filter((b: Balance) => filter(b));
    }

    toggleFilterNonZero(){
        this.viewData.filterNonZero = !this.viewData.filterNonZero;
        this.viewData.monthBalance = this.filterMonthBalance();
    }

    renderMovements(balance: Balance, event: Event){
        event && event.preventDefault && event.preventDefault();
        this.services.movement.getAllForUser(this.user).then((list: Array<Movement>) => {
            let ref = balance.bal_year * 100 + balance.bal_month;
            this.viewData.movements = list.filter(m => {
                let movRef = (new Date(m.mov_date)).getFullYear() * 100 + ((new Date(m.mov_date)).getMonth() + 1);
                return ref === movRef && (balance.bal_id_account === m.mov_id_account || balance.bal_id_account === m.mov_id_account_to);
            });
            this.model.selectedBalance = balance;
            console.log(`movements fetched for balance`, balance, this.viewData.movements);
        });
    }
}