/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
//import 'zone.js/dist/zone';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import 'core-js/es6/reflect';

import { AppModule } from './app/app.module';

//enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
