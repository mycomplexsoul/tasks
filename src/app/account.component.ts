import { Component, OnInit, Renderer } from '@angular/core';
//import { TasksCore } from '../app/tasks.core';
//import { SyncAPI } from '../app/sync.api';
import { Account } from './account.type';

@Component({
    selector: 'account',
    templateUrl: './account.template.html',
    providers: []
})
export class AccountComponent implements OnInit {
    public accountList: Array<Account> = [];

    constructor(){
        let a = new Account({
            acc_id: "001"
            , acc_name: "CAPITAL"
            , acc_ctg_type: 4
            , acc_comment: "Capital Account"
            , acc_check_day: 1
            , acc_average_min_balance: 0
            , acc_payment_day: 0
        });

        this.accountList.push(a);

        a = new Account({
            acc_id: "002"
            , acc_name: "Mosho Cartera"
            , acc_ctg_type: 1
            , acc_comment: "Efectivo"
            , acc_check_day: 1
            , acc_average_min_balance: 0
            , acc_payment_day: 0
        });
        this.accountList.push(a);
    }

    ngOnInit(){

    }

    showNewAccountForm(){
        
    }
}