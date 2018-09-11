import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { TasksComponent }  from './task/tasks.component';
import { MenuComponent }  from './common/menu.component';

import { AccountComponent }  from './money/account.component';
import { MovementComponent }  from './money/movement.component';
import { BalanceComponent }  from './money/balance.component';
import { RebuildComponent }  from './money/rebuild.component';

import { StorageService }  from './common/storage.service';
import { EntryService }  from './money/entry.service';
import { DateCommon } from './common/date.common';
import { ComboItemComponent } from './common/comboItem.component';
import { SyncAPI } from './common/sync.api';
import { UtilsCommon } from './common/utils.common';
import { LoginComponent }  from './common/login.component';

const appRoutes: Routes = [
    // { path: 'crisis-center', component: CrisisListComponent },
    // { path: 'hero/:id',      component: HeroDetailComponent },
    {
        path: 'tasks',
        component: TasksComponent,
        data: { title: 'Tasks' }
    },{
        path: 'account',
        component: AccountComponent,
        data: { title: 'Accounts' }
    },{
        path: 'movement',
        component: MovementComponent,
        data: { title: 'Movements' }
    },{
        path: 'balance',
        component: BalanceComponent,
        data: { title: 'Balance' }
    },{
        path: 'rebuild',
        component: RebuildComponent,
        data: { title: 'Rebuild' }
    },{
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
    },{
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent, TasksComponent, AccountComponent, MovementComponent, BalanceComponent, ComboItemComponent, MenuComponent, RebuildComponent, LoginComponent ], // parent & child components
  bootstrap: [ AppComponent ], // only parent components
  providers: [ DateCommon, StorageService, EntryService, SyncAPI, UtilsCommon ]
})
export class AppModule { }