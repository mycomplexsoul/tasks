import { Component, OnInit } from '@angular/core';
// import { Routes, ROUTER_DIRECTIVES } from '@angular/router';
// import { TasksComponent } from './tasks.component';
// import { AccountComponent } from './account.component';

@Component({
    selector: 'my-app',
    template: `<menu></menu><router-outlet></router-outlet>`
    // ,directives: [ROUTER_DIRECTIVES]
})
// @Routes([
//     {path: '/', component: TasksComponent}
//     ,{path: '/task', component: TasksComponent}
//     ,{path: '/account', component: AccountComponent}
// ])
export class AppComponent implements OnInit {
    ngOnInit(){

    }
 }
