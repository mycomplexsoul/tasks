import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { TasksComponent }  from './tasks.component';

import { AccountComponent }  from './account.component';
import { MovementComponent }  from './movement.component';

import { StorageService }  from './storage.service';
import { DateCommon } from './date.common';
import { ComboItemComponent } from './comboItem.component';

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
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent, TasksComponent, AccountComponent, MovementComponent, ComboItemComponent ], // parent & child components
  bootstrap: [ AppComponent ], // only parent components
  providers: [ DateCommon, StorageService ]
})
export class AppModule { }