import { Component, OnInit, Renderer } from '@angular/core';

// types
//import { Balance } from './balance.type';

// services
import { StorageService }  from '../common/storage.service';
//import { BalanceService } from './balance.service';

@Component({
    selector: 'menu',
    templateUrl: './menu.template.html',
    styleUrls: ['./menu.css'],
    providers: [
        //BalanceService
    ]
})
export class MenuComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        user: string
    } = {
        user: 'anon'
    };
    public services = {
        
    };

    constructor(
        
    ){
        
    }

    ngOnInit(){
        
    }
}