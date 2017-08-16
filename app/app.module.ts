import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { TasksComponent }  from './tasks.component';

import { DateCommon } from './date.common';

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent, TasksComponent ], // parent & child components
  bootstrap: [ AppComponent ], // only parent components
  providers: [ DateCommon ]
})
export class AppModule { }
