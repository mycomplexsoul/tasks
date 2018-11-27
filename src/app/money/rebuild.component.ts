import { Component, OnInit, Renderer, transition } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { Balance } from './balance.type';

// services
import { EntryService } from './entry.service';
import { BalanceService } from './balance.service';
import { SyncAPI } from '../common/sync.api';

@Component({
    selector: 'rebuild',
    templateUrl: './rebuild.template.html',
    providers: [
        EntryService
        , BalanceService
    ]
})
export class RebuildComponent implements OnInit {
    public services: {
        entry: EntryService
        , balance: BalanceService
    } = {
        entry: null
        , balance: null
    };
    public user: string = 'anon';
    private sync: SyncAPI = null;
    public model: {
        month: number
        , parsedYear: number
        , parsedMonth: number
    } = {
        month: 0
        , parsedYear: 0
        , parsedMonth: 0
    };
    public viewData: {
        monthList: Array<any>
    } = {
        monthList: []
    };
    
    constructor(
        entryService: EntryService
        , balanceService: BalanceService
        , syncService: SyncAPI
    ){
        this.services.entry = entryService;
        this.services.balance = balanceService;
        this.sync = syncService;
    }

    ngOnInit(){
        this.months().then((response: any[]) => {
            this.viewData.monthList = response;
        });
    }

    parseMonthName(iterable: number){
        let year: number = Math.floor(iterable / 100);
        let month: number = iterable % 100;
        const months: string[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return `${year} / ${months[month - 1]}`;
    }

    months(){
        let currentDate: Date = new Date();
        let max: number = currentDate.getFullYear() * 100 + (currentDate.getMonth() + 1)
        this.model.month = max;
        return this.services.balance.getAll().then((response: Balance[]) => {
            let min: number = response.map((b: Balance) => b.bal_year * 100 + b.bal_month)
                .reduce((previous, current) => previous <= current ? previous : current, 999999);
            
            let month: any;
            let list: Array<any> = [];
            if (min === 999999) {
                min = 201602;
            }
            while (min <= max){
                console.log('calculated',min);
                list.push({
                    iterable: min
                    , name: this.parseMonthName(min)
                });
                min = this.services.balance.getNextMonth(Math.floor(min / 100), min % 100).iterable;
            }
            return list.reverse();
        });
    }

    parseModel(){
        this.model.month = parseInt(this.model.month+'');
        this.model.parsedYear = Math.floor(this.model.month / 100);
        this.model.parsedMonth = this.model.month % 100;
    }

    rebuild(){
        this.parseModel();
        // this.services.balance.rebuild(this.model.parsedYear, this.model.parsedMonth, this.user);
        this.sync.post('/api/balance/rebuild', {
            year: this.model.parsedYear,
            month: this.model.parsedMonth,
            user: 'anon'
        });
    }
    
    transfer(){
        this.parseModel();
        // this.services.balance.transfer(this.model.parsedYear, this.model.parsedMonth, this.user);
        this.sync.post('/api/balance/transfer', {
            year: this.model.parsedYear,
            month: this.model.parsedMonth,
            user: 'anon'
        });
    }
    
    rebuildAndTransfer(){
        this.parseModel();
        // this.services.balance.rebuildAndTransfer(this.model.parsedYear, this.model.parsedMonth, this.user);
        this.sync.post('/api/balance/rebuild-and-transfer', {
            year: this.model.parsedYear,
            month: this.model.parsedMonth,
            user: 'anon'
        });
    }
    
    rebuildAndTransferUntilCurrentMonth(){
        this.parseModel();
        // let currentDate: Date = new Date();
        // this.services.balance.rebuildAndTransferRange(this.model.parsedYear, this.model.parsedMonth, currentDate.getFullYear(), currentDate.getMonth() + 1, this.user);
        this.sync.post('/api/balance/rebuild-and-transfer-range', {
            year: this.model.parsedYear,
            month: this.model.parsedMonth,
            user: 'anon'
        });
    }
}